import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Member } from "@/features/members/types";

export const useMember = (id?: string) => {
  const queryClient = useQueryClient();
  
  const getMember = useQuery({
    queryKey: ["member", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select(`
          *,
          current_membership:memberships(
            id,
            start_date,
            end_date,
            payment_status
          )
        `)
        .eq("id", id)
        .is("deleted_at", null)  // Agregar este filtro
        .order('created_at', { foreignTable: 'memberships', ascending: false })
        .limit(1, { foreignTable: 'memberships' })
        .single();

      if (error) throw error;
      
      // Transform the data to match our Member type
      const member = {
        ...data,
        current_membership: data.current_membership?.[0] || null
      };
      
      return member as Member;
    },
    enabled: !!id,
  });
  
  const deleteMember = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("members")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id)
        .is("deleted_at", null); // Solo actualizar si no está ya borrado

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
  
  return {
    member: getMember.data,
    isLoading: getMember.isLoading,
    deleteMember: deleteMember.mutateAsync,
  };
};
