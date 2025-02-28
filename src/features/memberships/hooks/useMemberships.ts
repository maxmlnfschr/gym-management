import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { MembershipFormData, Membership } from '../types';
import { addMonths } from 'date-fns';

export const useMemberships = (memberId?: string) => {
  const queryClient = useQueryClient();
  const getMemberships = useQuery({
    queryKey: ['memberships', memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('memberships')
        .select('*')
        .eq('member_id', memberId)
        .order('start_date', { ascending: false });  // Changed from startDate

      if (error) throw error;
      return data as Membership[];
    },
    enabled: !!memberId,
  });

  const createMembership = useMutation({
    mutationFn: async (data: MembershipFormData & { memberId: string }) => {
      // Verificar y actualizar membresías activas existentes
      const { data: activeMemberships } = await supabase
        .from('memberships')
        .select('*')
        .eq('member_id', data.memberId)
        .gte('end_date', new Date().toISOString());

      if (activeMemberships && activeMemberships.length > 0) {
        await supabase
          .from('memberships')
          .update({ end_date: new Date().toISOString() })
          .eq('member_id', data.memberId)
          .gte('end_date', new Date().toISOString());
      }

      // Crear nueva membresía (código existente)
      const startDate = new Date(data.startDate).toISOString();
      const endDate = addMonths(
        new Date(data.startDate), 
        data.planType === 'monthly' ? 1 : data.planType === 'quarterly' ? 3 : 12
      ).toISOString();
      
      const { data: membership, error } = await supabase
        .from('memberships')
        .insert([
          {
            member_id: data.memberId,
            plan_type: data.planType,
            start_date: startDate,
            end_date: endDate,
            payment_status: data.paymentStatus,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating membership:', error);
        throw error;
      }
      return membership;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberships', memberId] });
    },
  });
  const getCurrentMembership = () => {
    if (!getMemberships.data) return null;
    const now = new Date();
    return getMemberships.data.find(membership => 
      new Date(membership.start_date) <= now &&    // Changed from startDate
      new Date(membership.end_date) >= now         // Changed from endDate
    );
  };

  return {
    memberships: getMemberships.data || [],
    currentMembership: getCurrentMembership(),
    isLoading: getMemberships.isLoading,
    createMembership,
  };
};