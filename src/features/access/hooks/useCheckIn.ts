import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckInResponse } from '../types';

export const useCheckIn = () => {
  const queryClient = useQueryClient();
  const checkInMutation = useMutation<CheckInResponse, Error, string>({
    mutationFn: async (memberId: string) => {
      // Asegurémonos de usar la fecha local correcta
      const now = new Date();
      const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
      const nowISOString = localDate.toISOString();

      console.log('Fecha actual:', {
        javascriptDate: now,
        localDate: localDate,
        isoString: nowISOString,
        timezoneOffset: now.getTimezoneOffset()
      });

      // Verificación de membresía activa
      const { data: memberships, error: membershipError } = await supabase
        .from('memberships')
        .select(`
          id,
          member_id,
          start_date,
          end_date,
          plan_type,
          created_at
        `)
        .eq('member_id', memberId)
        .lte('start_date', nowISOString)
        .gte('end_date', nowISOString)
        .order('created_at', { ascending: false })
        .limit(1);
      
      console.log('Membership check:', {
        now,
        memberships,
        membershipError
      });

      if (membershipError) {
        console.error('Membership error:', membershipError);
        throw new Error('Error al verificar membresía');
      }
      
      if (!memberships || memberships.length === 0) {
        throw new Error('No hay membresía activa para este miembro');
      }

      const activeMembership = memberships[0];

      // Then create access log
      const { data: accessLog, error: accessError } = await supabase
        .from('access_logs')
        .insert([{
          member_id: memberId,
          check_in: now,
        }])
        .select()
        .single();

      if (accessError) throw accessError;

      // Return combined data
      return {
        ...accessLog,
        membership: {
          id: activeMembership.id,
          status: 'active',
          end_date: activeMembership.end_date
        }
      } as CheckInResponse;
    },
    onSuccess: () => {
      // Invalidar tanto access-logs como accesses
      queryClient.invalidateQueries({ queryKey: ['access-logs'] });
      queryClient.invalidateQueries({ queryKey: ['accesses'] });
    },
  });
  return {
    checkIn: checkInMutation.mutateAsync,
    isLoading: checkInMutation.isPending,
    error: checkInMutation.error ? checkInMutation.error.message : null,
  };
};