import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { addDays, isWithinInterval } from 'date-fns';
import { Membership } from '../types';

export const useExpirationNotifications = () => {
  const getExpiringMemberships = useQuery({
    queryKey: ['expiring-memberships'],
    queryFn: async () => {
      const nextWeek = addDays(new Date(), 7);
      
      const { data, error } = await supabase
        .from('memberships')
        .select('*, members(first_name, last_name, email)')
        .lte('endDate', nextWeek)
        .gte('endDate', new Date())
        .eq('paymentStatus', 'paid');

      if (error) throw error;
      return data as (Membership & { members: { first_name: string; last_name: string; email: string } })[];
    },
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
  });

  return {
    expiringMemberships: getExpiringMemberships.data || [],
    isLoading: getExpiringMemberships.isLoading,
  };
};