import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { startOfDay, subDays, format } from 'date-fns';

// Añadir esta interfaz después de los imports
// Update the interface to match Supabase response
interface AccessLogWithMember {
  id: string;
  check_in: string;
  members: {
    first_name: string;
    last_name: string;
  };
}

interface CheckInMetrics {
  todayCount: number;
  yesterdayCount: number;
  percentageChange: number;
  hourlyDistribution: Record<string, number>;
  todayCheckIns: Array<{
    id: string;
    check_in: string;
    member: {
      first_name: string;
      last_name: string;
    };
  }>;
}

export const useCheckInMetrics = () => {
  return useQuery({
    queryKey: ['check-in-metrics'],
    queryFn: async (): Promise<CheckInMetrics> => {
      const today = startOfDay(new Date());
      const yesterday = subDays(today, 1);

      // Get today's check-ins with member info
      const { data: todayData, error: todayError } = await supabase
        .from('access_logs')
        .select(`
          id,
          check_in,
          members (
            first_name,
            last_name
          )
        `)
        .gte('check_in', today.toISOString())
        .order('check_in', { ascending: false });

      if (todayError) throw todayError;

      // Get yesterday's check-ins (count only)
      const { data: yesterdayData, error: yesterdayError } = await supabase
        .from('access_logs')
        .select('id')
        .gte('check_in', yesterday.toISOString())
        .lt('check_in', today.toISOString());

      if (yesterdayError) throw yesterdayError;

      // Calculate metrics
      const todayCount = todayData?.length || 0;
      const yesterdayCount = yesterdayData?.length || 0;
      const percentageChange = yesterdayCount === 0 
        ? 100 
        : ((todayCount - yesterdayCount) / yesterdayCount) * 100;

      // Calculate hourly distribution
      const hourlyDistribution: Record<string, number> = {};
      todayData?.forEach(log => {
        const hour = format(new Date(log.check_in), 'HH:00');
        hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + 1;
      });

      // Transform the data to match the interface
      const formattedTodayData = ((todayData as unknown) as AccessLogWithMember[])?.map((item: AccessLogWithMember) => ({
        id: item.id,
        check_in: item.check_in,
        member: {
          first_name: item.members.first_name || '',
          last_name: item.members.last_name || ''
        }
      })) || [];

      return {
        todayCount,
        yesterdayCount,
        percentageChange,
        hourlyDistribution,
        todayCheckIns: formattedTodayData
      };
    },
    refetchInterval: 5 * 60 * 1000,
  });
};