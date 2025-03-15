import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { addDays, format } from 'date-fns';
import { getMembershipStatus } from '@/utils/dateUtils';

interface MembershipMetrics {
  activeMembers: number;
  expiringThisWeek: number;
}

export const useMembershipMetrics = () => {
  return useQuery({
    queryKey: ['membership-metrics'],
    queryFn: async (): Promise<MembershipMetrics> => {
      const today = new Date();
      const todayStr = format(today, 'yyyy-MM-dd');
      const nextWeek = addDays(today, 7);
      const nextWeekStr = format(nextWeek, 'yyyy-MM-dd');
      
      // Obtener membresías activas usando latest_memberships
      const { data: activeData, error: activeError } = await supabase
        .from('latest_memberships')
        .select(`
          id,
          member_id,
          start_date,
          end_date,
          payment_status,
          plan_type,
          members!inner(
            id,
            deleted_at
          )
        `)
        .is('members.deleted_at', null)
        .gte('end_date', todayStr);

      if (activeError) throw activeError;

      // Procesar cada membresía con getMembershipStatus
      const memberships = activeData?.map(membership => ({
        ...membership,
        status: getMembershipStatus(membership)
      })) || [];

      // Filtrar miembros activos y por vencer
      const activeMembers = memberships.filter(m => 
        m.end_date >= todayStr
      );

      const expiringMembers = memberships.filter(m => 
        m.end_date >= todayStr && 
        m.end_date <= nextWeekStr
      );

      return {
        activeMembers: activeMembers.length,
        expiringThisWeek: expiringMembers.length
      };
    },
    refetchInterval: 5 * 60 * 1000,
  });
};