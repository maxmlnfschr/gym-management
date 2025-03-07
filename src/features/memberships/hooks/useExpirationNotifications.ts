import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { addDays } from 'date-fns';
import { Membership } from '../types';
import { useMemberships } from './useMemberships';

// Importar la función getMembershipStatus
import { getMembershipStatus } from "@/utils/dateUtils";

export const useExpirationNotifications = () => {
  const { data: memberships, isLoading } = useQuery({
    queryKey: ['memberships'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('latest_memberships')
        .select(`
          *,
          members!inner(
            first_name,
            last_name,
            email,
            deleted_at,
            status
          )
        `);
      
      if (error) throw error;
      return data;
    }
  });
  
  // Filtrar primero los miembros eliminados
  const activeMembers = memberships?.filter(membership => 
    !membership.members.deleted_at && membership.members.status !== 'deleted'
  ) || [];
  
  // Filtrar las membresías según su estado de vigencia (independiente del pago)
  const expiredMemberships = activeMembers.filter(membership => {
    const endDate = new Date(membership.end_date);
    const today = new Date();
    return endDate < today;
  });

  const expiringMemberships = activeMembers.filter(membership => {
    const endDate = new Date(membership.end_date);
    const today = new Date();
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return endDate > today && endDate <= sevenDaysFromNow;
  });

  // Membresías con pago pendiente (independiente de su fecha de vencimiento)
  const pendingMemberships = activeMembers.filter(membership => {
    return membership.payment_status === "pending";
  });
  
  return {
    expiredMemberships,
    expiringMemberships,
    pendingMemberships,
    isLoading
  };
};