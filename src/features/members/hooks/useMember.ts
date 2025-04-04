import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Member } from "@/features/members/types";
import { useMembershipFilters } from "@/features/memberships/hooks/useMembershipFilters";
import { Membership } from "@/features/memberships/types";

export const useMember = (id?: string) => {
  const queryClient = useQueryClient();
  
  const getMember = useQuery({
    queryKey: ["member", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select(`
          *,
          current_membership:memberships(
            id,
            start_date,
            end_date,
            payment_status,
            plan_type
          )
        `)
        .eq('id', id)
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
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
  
  // Transform current_membership to match Membership type
  const currentMembership = getMember.data?.current_membership ? {
    ...getMember.data.current_membership,
    member_id: id || '',
    status: 'active', // or calculate based on dates
    created_at: getMember.data.current_membership.start_date, // fallback to start_date if created_at is not available
  } as Membership : null;

  const membershipFilters = useMembershipFilters(currentMembership ? [currentMembership] : []);
  
  return {
    member: getMember.data,
    isLoading: getMember.isLoading,
    deleteMember: deleteMember.mutateAsync,
    membershipStatus: membershipFilters.status,
    paymentStatus: membershipFilters.payment,
  };
};
