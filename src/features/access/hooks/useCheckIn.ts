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
      const now = new Date().toISOString();
      console.log('Checking access for member:', memberId);
      console.log('Current datetime:', now);
    
      // Verificación de membresía activa
      const { data: memberships, error: membershipError } = await supabase
        .from('memberships')
        .select(`
          *,
          members:member_id (
            first_name,
            last_name
          )
        `)
        .eq('member_id', memberId)
        .lte('start_date', now)
        .gte('end_date', now)
        .order('end_date', { ascending: false });  // Obtener la membresía más reciente primero
    
      console.log('Membership query result:', { memberships, membershipError });
    
      if (membershipError) {
        console.error('Membership error details:', membershipError);
        throw new Error('Error al verificar membresía');
      }
    
      if (!memberships || memberships.length === 0) {
        throw new Error('No hay membresía activa');
      }

      const activeMembership = memberships[0]; // Usar la membresía más reciente
    
      // Si llegamos aquí, la membresía está activa, registramos el acceso
      const { data: accessLog, error: accessError } = await supabase
        .from('access_logs')
        .insert([
          {
            member_id: memberId,
            check_in: new Date().toISOString(),
          },
        ])
        .select()
        .single();
    
      if (accessError) throw accessError;
      return accessLog;
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