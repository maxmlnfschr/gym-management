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

      // Si hay membresías activas, actualizamos su fecha de fin
      if (activeMemberships && activeMemberships.length > 0) {
        const startDate = new Date(data.startDate);
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(23, 59, 59, 999);

        await supabase
          .from("memberships")
          .update({ 
            end_date: startDate.toISOString(),
            payment_status: 'overdue'
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
      queryClient.invalidateQueries({ queryKey: ["memberships", memberId] });
    },
  });
  const getCurrentMembership = () => {
    if (!getMemberships.data) return null;
    
    // Ordenar por fecha de creación, la más reciente primero
    return getMemberships.data.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    })[0];
  };
  return {
    memberships: getMemberships.data || [],
    currentMembership: getCurrentMembership(),
    isLoading: getMemberships.isLoading,
    createMembership,
  };
};
