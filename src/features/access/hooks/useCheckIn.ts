import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckInResponse } from '../types';

export const useCheckIn = () => {
  const queryClient = useQueryClient();
  const checkInMutation = useMutation<CheckInResponse, Error, string>({
    mutationFn: async (memberId: string) => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const nowISOString = today.toISOString();

      // Verificar membresía usando latest_memberships
      const { data: memberships, error: membershipError } = await supabase
        .from('latest_memberships')
        .select(`
          id,
          member_id,
          start_date,
          end_date,
          plan_type,
          created_at,
          payment_status
        `)
        .eq('member_id', memberId)
        .order('created_at', { ascending: false });
      if (membershipError) throw membershipError;
      
      const membership = memberships?.[0];
      
      if (!membership) {
        throw new Error('No se encontró una membresía');
      }
      
      // Verificar si la membresía está vencida (por fecha)
      const membershipEndDate = new Date(membership.end_date);
      membershipEndDate.setHours(0, 0, 0, 0);
      const isLastDay = membership.end_date === today.toISOString().split('T')[0];
      
      // Allow access if membership ends today or is future
      if (membershipEndDate < today && !isLastDay) {
        throw new Error('La membresía está vencida');
      }
      
      // Verificar si el pago está pendiente (separado de la fecha)
      if (membership.payment_status === 'pending') {
        throw new Error('El pago de la membresía está pendiente');
      }
      
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
          id: membership.id,
          status: isLastDay ? 'last_day' : 'active',
          end_date: membership.end_date
        }
      } as CheckInResponse;
    },
    onSuccess: () => {
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