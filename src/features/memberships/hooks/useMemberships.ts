import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { MembershipFormData, Membership } from "@/features/memberships/types";

export const useMemberships = (memberId?: string) => {
  const queryClient = useQueryClient();
  const getMemberships = useQuery({
    queryKey: ["memberships", memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("memberships")
        .select("*")
        .eq("member_id", memberId)
        .order("start_date", { ascending: false }); // Changed from startDate

      if (error) throw error;
      return data as Membership[];
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

      // Si hay membresías activas, actualizamos su fecha de inicio para que termine hoy
      if (activeMemberships && activeMemberships.length > 0) {
        const adjustedStartDate = new Date();
        adjustedStartDate.setMonth(adjustedStartDate.getMonth() - 1);

        await supabase
          .from("memberships")
          .update({ start_date: adjustedStartDate.toISOString() })
          .eq("member_id", data.memberId)
          .gte("end_date", new Date().toISOString());
      }

      // Crear nueva membresía
      const startDate = new Date(data.startDate).toISOString();

      const { data: membership, error } = await supabase
        .from("memberships")
        .insert([
          {
            member_id: data.memberId,
            plan_type: data.planType,
            start_date: startDate,
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
      queryClient.invalidateQueries({ queryKey: ["memberships", memberId] });
    },
  });
  const getCurrentMembership = () => {
    if (!getMemberships.data) return null;
    const now = new Date();
    return getMemberships.data.find(
      (membership) =>
        new Date(membership.start_date) <= now && // Changed from startDate
        new Date(membership.end_date) >= now // Changed from endDate
    );
  };

  return {
    memberships: getMemberships.data || [],
    currentMembership: getCurrentMembership(),
    isLoading: getMemberships.isLoading,
    createMembership,
  };
};
