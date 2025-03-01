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
      // Establecer la hora a 00:00:00 para comparar solo fechas
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const nowISOString = today.toISOString();

      console.log('Fecha actual:', {
        javascriptDate: now,
        today,
        isoString: nowISOString,
        timezoneOffset: now.getTimezoneOffset()
      });

      // Primero verificamos si el miembro tiene alguna membresía
      const { data: allMemberships, error: checkError } = await supabase
        .from('memberships')
        .select('*')
        .eq('member_id', memberId);

      if (checkError) throw checkError;

      if (!allMemberships || allMemberships.length === 0) {
        throw new Error('El miembro no tiene ninguna membresía registrada');
      }

      // Luego verificamos membresía activa
      const { data: memberships, error: membershipError } = await supabase
        .from('memberships')
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
        .order('created_at', { ascending: false })
        .limit(1);

      if (membershipError) throw membershipError;
      
      if (!memberships || memberships.length === 0) {
        throw new Error('La membresía está vencida');
      }

      const latestMembership = memberships[0];
      const membershipEndDate = new Date(latestMembership.end_date);
      membershipEndDate.setHours(0, 0, 0, 0);
      const isLastDay = latestMembership.end_date === today.toISOString().split('T')[0];

      console.log('Membership check:', {
        now,
        memberships,
        membershipError,
        membershipEndDate: membershipEndDate.toISOString(),
        todayDate: today.toISOString(),
        isLastDay,
        comparison: {
          endDateTimestamp: membershipEndDate.getTime(),
          todayTimestamp: today.getTime(),
          isExpired: membershipEndDate < today
        }
      });

      // Allow access if membership ends today or is future
      if (membershipEndDate < today && !isLastDay) {
        throw new Error('La membresía está vencida');
      }

      const activeMembership = latestMembership;

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
          status: isLastDay ? 'last_day' : 'active',
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