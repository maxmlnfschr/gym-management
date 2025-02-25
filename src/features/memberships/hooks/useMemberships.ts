import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { MembershipFormData, Membership } from '../types';
import { addMonths } from 'date-fns';

export const useMemberships = (memberId?: string) => {
  const getMemberships = useQuery({
    queryKey: ['memberships', memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('memberships')
        .select('*')
        .eq('member_id', memberId)
        .order('startDate', { ascending: false });

      if (error) throw error;
      return data as Membership[];
    },
    enabled: !!memberId,
  });

  const createMembership = useMutation({
    mutationFn: async (data: MembershipFormData & { memberId: string }) => {
      const endDate = addMonths(data.startDate, data.planType === 'monthly' ? 1 : 12);
      
      const { data: membership, error } = await supabase
        .from('memberships')
        .insert([
          {
            member_id: data.memberId,
            planType: data.planType,
            startDate: data.startDate,
            endDate,
            paymentStatus: data.paymentStatus,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return membership;
    },
  });

  const getCurrentMembership = () => {
    if (!getMemberships.data) return null;
    const now = new Date();
    return getMemberships.data.find(membership => 
      new Date(membership.startDate) <= now && 
      new Date(membership.endDate) >= now
    );
  };

  return {
    memberships: getMemberships.data || [],
    currentMembership: getCurrentMembership(),
    isLoading: getMemberships.isLoading,
    createMembership,
  };
};