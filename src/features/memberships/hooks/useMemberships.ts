import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { MembershipFormData, Membership } from "@/features/memberships/types";
import { getMembershipStatus } from "@/utils/dateUtils";

// Eliminar esta primera declaración
// export const useMemberships = (memberId: string) => {
//   const queryKey = ['memberships', memberId];
//   
//   return useQuery(queryKey, async () => {
//     const response = await axios.get(`/api/members/${memberId}/memberships`, {
//       params: {
//         include: ['membership_plans'], // Asegurarnos de incluir los planes
//       }
//     });
//     return response.data;
//   });
// };

export const useMemberships = (memberId?: string) => {
  const queryClient = useQueryClient();

  const getMemberships = useQuery({
    queryKey: ["memberships", memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("memberships")
        .select(`
          *,
          members!inner(
            first_name,
            last_name,
            email,
            deleted_at,
            status
          ),
          membership_plans(
            name,
            price,
            description
          )
        `)
        .eq("member_id", memberId)
        .order("start_date", { ascending: false });

      if (error) throw error;
      return data as Membership[];
    },
    enabled: !!memberId,
  });

  // Consulta específica para la membresía actual
  const getCurrentMembership = useQuery({
    queryKey: ["current-membership", memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("latest_memberships")
        .select(
          `
          *,
          members!inner(
            first_name,
            last_name,
            email,
            deleted_at,
            status
          )
        `
        )
        .eq("member_id", memberId)
        .single();

      if (error) throw error;
      if (!data) return null;

      const status = getMembershipStatus(data);
      return {
        ...data,
        status: status.status,
        statusLabel: status.label,
        statusColor: status.color,
      } as Membership & {
        status: string;
        statusLabel: string;
        statusColor: string;
      };
    },
    enabled: !!memberId,
  });

  const createMembership = useMutation({
    mutationFn: async (data: MembershipFormData & { memberId: string }) => {
      // Primero obtenemos el plan para saber su duración
      const { data: plan, error: planError } = await supabase
        .from("membership_plans")
        .select("*")
        .eq("id", data.planId)
        .single();

      if (planError) throw planError;

      // Verificar membresías activas existentes
      const { data: activeMemberships } = await supabase
        .from("memberships")
        .select("*")
        .eq("member_id", data.memberId)
        .gte("end_date", new Date().toISOString());

      // Si hay membresías activas, actualizamos su fecha de fin
      if (activeMemberships && activeMemberships.length > 0) {
        const startDate = new Date(data.startDate);

        await supabase
          .from("memberships")
          .update({
            end_date: startDate.toISOString().split("T")[0], // Solo la fecha, sin tiempo
          })
          .eq("member_id", data.memberId)
          .gte("end_date", new Date().toISOString());
      }

      // Crear la nueva membresía
      const startDate = new Date(data.startDate);
      const endDate = new Date(startDate);

      // Asegurarnos que duration_months sea válido
      if (!plan.duration_months || plan.duration_months <= 0) {
        throw new Error("Invalid plan duration");
      }

      // Calcular fecha fin
      endDate.setMonth(endDate.getMonth() + plan.duration_months);

      // Formatear fechas usando una función más robusta
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);

      console.log("Debug - Dates:", {
        raw: { startDate, endDate },
        formatted: { formattedStartDate, formattedEndDate },
      });

      const membershipData = {
        member_id: data.memberId,
        plan_id: data.planId,
        plan_type: data.planType, // Ahora podemos usar directamente planType
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        payment_status: data.paymentStatus,
        amount: Number(plan.price) || 0,
      };

      const { data: membership, error } = await supabase
        .from("memberships")
        .insert([membershipData])
        .select("*")
        .single();

      if (error) {
        console.error("Error creating membership:", error);
        throw error;
      }

      // Crear el pago si es necesario
      if (data.payment_method && data.paymentStatus === "paid") {
        const { error: paymentError } = await supabase
          .from("membership_payments")
          .insert([
            {
              membership_id: membership.id,
              amount: Number(plan.price) || 0,
              payment_method: data.payment_method,
              notes: data.payment_notes,
              status: "paid",
            },
          ]);

        if (paymentError) {
          console.error("Error creating payment:", paymentError);
          throw paymentError;
        }
      }

      return membership;
    },
    onSuccess: () => {
      // Invalidar todas las queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["memberships", memberId] });
      queryClient.invalidateQueries({
        queryKey: ["current-membership", memberId],
      });
      queryClient.invalidateQueries({ queryKey: ["membership-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["finance-metrics"] });
    },
  });
  return {
    memberships: getMemberships.data || [],
    currentMembership: getCurrentMembership.data,
    isLoading: getMemberships.isLoading || getCurrentMembership.isLoading,
    createMembership,
  };
};
