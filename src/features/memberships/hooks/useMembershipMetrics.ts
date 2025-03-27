import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { addDays, format } from 'date-fns';
import { Membership } from '../types';

interface MembershipMetrics {
  activeMembers: number;
  expiringThisWeek: number;
  expiredMemberships: number;
}

const calculateMetrics = (memberships: Membership[]): MembershipMetrics => {
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const nextWeek = addDays(today, 7);
  const nextWeekStr = format(nextWeek, 'yyyy-MM-dd');

  const activeMembers = memberships.filter(m => 
    m.end_date >= todayStr && !m.deleted_at
  );

  const expiringMembers = memberships.filter(m => 
    m.end_date >= todayStr && 
    m.end_date <= nextWeekStr && 
    !m.deleted_at
  );

  const expiredMembers = memberships.filter(m => 
    m.end_date < todayStr && 
    !m.deleted_at
  );

  return {
    activeMembers: activeMembers.length,
    expiringThisWeek: expiringMembers.length,
    expiredMemberships: expiredMembers.length
  };
};

export const useMembershipMetrics = () => {
  return useQuery({
    queryKey: ['membership-metrics'],
    queryFn: async (): Promise<MembershipMetrics> => {
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
        .is('members.deleted_at', null);

      if (activeError) throw activeError;

      const memberships = activeData?.map(membership => ({
        ...membership,
        created_at: membership.start_date,
        members: {
          first_name: '',
          last_name: '',
          email: '',
          status: 'active'
        }
      })) as Membership[];

      return calculateMetrics(memberships);
    },
    refetchInterval: 5 * 60 * 1000,
  });
};