import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { MembershipFormData, Membership } from "@/features/memberships/types";
import { getMembershipStatus } from "@/utils/dateUtils";

export const useMemberships = (memberId?: string) => {
  const queryClient = useQueryClient();
  
  // Consulta para obtener todas las membresías (historial)
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
        .select(`
          *,
          members!inner(
            first_name,
            last_name,
            email,
            deleted_at,
            status
          )
        `)
        .eq("member_id", memberId)
        .single();

      if (error) throw error;
      if (!data) return null;

      const status = getMembershipStatus(data);
      return {
        ...data,
        status: status.status,
        statusLabel: status.label,
        statusColor: status.color
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
      // Verificar membresías activas existentes
      const { data: activeMemberships } = await supabase
        .from("memberships")
        .select("*")
        .eq("member_id", data.memberId)
        .gte("end_date", new Date().toISOString());

      // Si hay membresías activas, actualizamos su fecha de fin
      if (activeMemberships && activeMemberships.length > 0) {
        const startDate = new Date(data.startDate);
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(23, 59, 59, 999);

        await supabase
          .from("memberships")
          .update({ 
            end_date: startDate.toISOString(),
            // Eliminamos esta línea para mantener el estado de pago original
            // payment_status: 'overdue'
          })
          .eq("member_id", data.memberId)
          .gte("end_date", new Date().toISOString());
      }

      // Crear la nueva membresía
      const startDate = new Date(data.startDate);
      const localDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      );

      const { data: membership, error } = await supabase
        .from("memberships")
        .insert([
          {
            member_id: data.memberId,
            plan_type: data.planType,
            start_date: localDate.toISOString().split('T')[0],
            payment_status: data.paymentStatus,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating membership:", error);
        throw error;
      }
      return membership;
    },
    onSuccess: () => {
      // Invalidar todas las queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["memberships", memberId] });
      queryClient.invalidateQueries({ queryKey: ["current-membership", memberId] });
      queryClient.invalidateQueries({ queryKey: ["membership-metrics"] });
    },
  });
  return {
    memberships: getMemberships.data || [],
    currentMembership: getCurrentMembership.data,
    isLoading: getMemberships.isLoading || getCurrentMembership.isLoading,
    createMembership,
  };
};
