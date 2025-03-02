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
      const { data: membership, error: membershipError } = await supabase
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
        .eq('payment_status', 'paid')
        .single();

      if (membershipError) throw membershipError;
      
      if (!membership) {
        throw new Error('La membresía está vencida');
      }

      const membershipEndDate = new Date(membership.end_date);
      membershipEndDate.setHours(0, 0, 0, 0);
      const isLastDay = membership.end_date === today.toISOString().split('T')[0];

      // Allow access if membership ends today or is future
      if (membershipEndDate < today && !isLastDay) {
        throw new Error('La membresía está vencida');
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