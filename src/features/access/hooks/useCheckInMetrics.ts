import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { startOfDay, subDays, format } from 'date-fns';

interface CheckInMetrics {
  todayCount: number;
  yesterdayCount: number;
  percentageChange: number;
  hourlyDistribution: Record<string, number>;
}

export const useCheckInMetrics = () => {
  return useQuery({
    queryKey: ['check-in-metrics'],
    queryFn: async (): Promise<CheckInMetrics> => {
      const today = startOfDay(new Date());
      const yesterday = subDays(today, 1);

      // Get today's check-ins
      const { data: todayData, error: todayError } = await supabase
        .from('access_logs')
        .select('check_in')
        .gte('check_in', today.toISOString())
        .order('check_in');

      if (todayError) throw todayError;

      // Get yesterday's check-ins
      const { data: yesterdayData, error: yesterdayError } = await supabase
        .from('access_logs')
        .select('check_in')
        .gte('check_in', yesterday.toISOString())
        .lt('check_in', today.toISOString())
        .order('check_in');

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

      return {
        todayCount,
        yesterdayCount,
        percentageChange,
        hourlyDistribution
      };
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};