import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { AccessLogWithMember } from '@/features/access/types';

export const useAccessLogs = () => {
  return useQuery<AccessLogWithMember[]>({
    queryKey: ['access-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('access_logs')
        .select(`
          *,
          members (
            first_name,
            last_name
          )
        `)
        .order('check_in', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
  });
};