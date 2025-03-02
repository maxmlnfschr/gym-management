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
      
      // Obtener membresías con información de miembros
      const { data: memberships, error } = await supabase
        .from('memberships')
        .select(`
          *,
          members (
            first_name,
            last_name,
            email,
            deleted_at,
            status
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Agrupar por miembro y obtener la más reciente
      const membershipMap = new Map();
      memberships?.forEach(membership => {
        if (!membershipMap.has(membership.member_id) || 
            new Date(membership.created_at) > new Date(membershipMap.get(membership.member_id).created_at)) {
          membershipMap.set(membership.member_id, membership);
        }
      });
      
      // Filtrar por fecha y miembros activos
      const filteredData = Array.from(membershipMap.values()).filter(membership => 
        !membership.members.deleted_at && 
        membership.members.status !== 'deleted' &&
        new Date(membership.end_date) <= nextWeek
      );
      
      // Separar membresías vencidas y por vencer
      const { expired, expiring } = filteredData.reduce((acc, membership) => {
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