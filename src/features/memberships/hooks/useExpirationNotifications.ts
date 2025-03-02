import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { addDays } from 'date-fns';
import { Membership } from '../types';

export const useExpirationNotifications = () => {
  const getExpiringMemberships = useQuery({
    queryKey: ['expiring-memberships'],
    queryFn: async () => {
      const today = new Date();
      const nextWeek = addDays(today, 7);
      today.setHours(0, 0, 0, 0);
      
      // Usar la vista latest_memberships en lugar de la tabla memberships
      const { data: memberships, error } = await supabase
        .from('latest_memberships')
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
        .lte('end_date', nextWeek.toISOString().split('T')[0]);
      
      if (error) throw error;
      
      // Filtrar miembros eliminados
      const filteredData = memberships?.filter(membership => 
        !membership.members.deleted_at && 
        membership.members.status !== 'deleted'
      );
      
      // Separar membresías vencidas y por vencer
      const { expired, expiring } = filteredData?.reduce((acc, membership) => {
        const endDate = new Date(membership.end_date);
        endDate.setHours(0, 0, 0, 0);
        
        if (endDate < today) {
          acc.expired.push(membership);
        } else if (endDate <= nextWeek) {
          acc.expiring.push(membership);
        }
        return acc;
      }, { expired: [], expiring: [] });
      
      return {
        expired,
        expiring
      };
    },
    refetchInterval: 1000 * 60 * 60,
  });

  return {
    expiredMemberships: getExpiringMemberships.data?.expired || [],
    expiringMemberships: getExpiringMemberships.data?.expiring || [],
    isLoading: getExpiringMemberships.isLoading,
  };
};