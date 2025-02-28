import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface AccessLog {
  id: string;
  member_id: string;
  check_in: string;
}

export const useCheckIn = () => {
  const queryClient = useQueryClient();

  const checkInMutation = useMutation<AccessLog, Error, string>({
    mutationFn: async (memberId: string) => {
      // Primero verificamos la membresía activa
      const { data: membership, error: membershipError } = await supabase
        .from('memberships')
        .select('*')
        .eq('member_id', memberId)
        .gte('end_date', new Date().toISOString())    // Changed from end_date
        .lte('start_date', new Date().toISOString())  // Changed from start_date
        .single();

      if (membershipError || !membership) {
        throw new Error('No hay membresía activa');
      }

      // Registramos el acceso
      const { data, error } = await supabase
        .from('access_logs')
        .insert([
          {
            member_id: memberId,
            check_in: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['access-logs'] });
    },
  });

  return {
    checkIn: checkInMutation.mutateAsync,
    isLoading: checkInMutation.isPending,
    error: checkInMutation.error ? checkInMutation.error.message : null,
  };
};