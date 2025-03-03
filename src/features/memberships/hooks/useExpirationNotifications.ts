import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { addDays } from 'date-fns';
import { Membership } from '../types';
import { useMemberships } from './useMemberships';

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
  const today = new Date();
  const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  // Filtrar primero los miembros eliminados
  const activeMembers = memberships?.filter(membership => 
    !membership.members.deleted_at && membership.members.status !== 'deleted'
  ) || [];
  
  const expiredMemberships = activeMembers.filter(membership => 
    new Date(membership.end_date) < today && membership.payment_status === "paid"
  );
  
  const expiringMemberships = activeMembers.filter(membership => {
    const endDate = new Date(membership.end_date);
    return endDate > today && endDate <= sevenDaysFromNow && membership.payment_status === "paid";
  });
  
  const pendingMemberships = activeMembers.filter(membership => 
    membership.payment_status === "pending"
  );
  return {
    expiredMemberships,
    expiringMemberships,
    pendingMemberships,
    isLoading
  };
};