import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Membership } from '../types';

export const useExpirationNotifications = () => {
  const getExpiringMemberships = useQuery({
    queryKey: ['expiring-memberships'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('memberships')
        .select('*, members(first_name, last_name, email)')
        .lt('end_date', today)
        .eq('payment_status', 'paid')
        .order('end_date', { ascending: false });

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