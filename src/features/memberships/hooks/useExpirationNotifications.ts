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
      
      // Primero obtenemos las últimas membresías de cada miembro
      const { data: latestMemberships, error } = await supabase
        .from('memberships')
        .select('*, members(first_name, last_name, email)')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) throw error;
          
          // Agrupar por member_id y tomar solo la más reciente
          const memberMap = new Map();
          data?.forEach(membership => {
            if (!memberMap.has(membership.member_id)) {
              memberMap.set(membership.member_id, membership);
            }
          });
          
          return { data: Array.from(memberMap.values()), error };
        });

      if (error) throw error;
      
      // Separar membresías vencidas y por vencer
      const { expired, expiring } = latestMemberships?.reduce((acc, membership) => {
        const endDate = new Date(membership.end_date);
        endDate.setHours(0, 0, 0, 0);
        
        if (endDate < today) {
          acc.expired.push(membership);
        } else if (endDate <= nextWeek) {
          acc.expiring.push(membership);
        }
        return acc;
      }, { expired: [], expiring: [] } as { 
        expired: typeof latestMemberships, 
        expiring: typeof latestMemberships 
      });
      
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