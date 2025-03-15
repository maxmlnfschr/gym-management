import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { startOfMonth, endOfMonth } from 'date-fns';

interface FinanceMetrics {
  currentMonthIncome: number;
  pendingPayments: number;
  pendingAmount: number;
}

interface MembershipWithPlan {
  id: string;
  plan: {
    price: number;
  } | null;
}

export const useFinanceMetrics = () => {
  return useQuery({
    queryKey: ['finance-metrics'],
    queryFn: async (): Promise<FinanceMetrics> => {
      const currentDate = new Date();
      const startDate = startOfMonth(currentDate);
      const endDate = endOfMonth(currentDate);

      // Get current month payments
      const { data: monthPayments, error: monthError } = await supabase
        .from('membership_payments')
        .select('amount')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (monthError) throw monthError;

      // Get pending payments
      const { data: pendingPayments, error: pendingError } = await supabase
        .from('memberships')
        .select(`
          id,
          plan:membership_plans(price)
        `)
        .eq('status', 'pending') as { data: MembershipWithPlan[] | null; error: any };

      if (pendingError) throw pendingError;

      const currentMonthIncome = monthPayments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
      const pendingAmount = pendingPayments?.reduce((sum, membership) => sum + (membership.plan?.price || 0), 0) || 0;

      return {
        currentMonthIncome,
        pendingPayments: pendingPayments?.length || 0,
        pendingAmount,
      };
    },
  });
};