import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface MembershipPlan {
  id: string;
  name: string;
  duration_months: number;
  price: number;
  active: boolean;
  description?: string;
  features?: string[];
}

export interface CreateMembershipPlanData {
  name: string;
  duration_months: number;
  price: number;
  description?: string;
  features?: string[];
}

export const useMembershipPlans = () => {
  const queryClient = useQueryClient();

  const getPlans = useQuery({
    queryKey: ['membership-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('membership_plans')
        .select('*')
        .order('duration_months');

      if (error) throw error;
      return data as MembershipPlan[];
    }
  });

  const createPlan = useMutation({
    mutationFn: async (planData: CreateMembershipPlanData) => {
      const { data, error } = await supabase
        .from('membership_plans')
        .insert([planData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership-plans'] });
    }
  });

  const updatePlan = useMutation({
    mutationFn: async ({ id, ...planData }: Partial<MembershipPlan> & { id: string }) => {
      const { data, error } = await supabase
        .from('membership_plans')
        .update(planData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership-plans'] });
    }
  });

  return {
    plans: getPlans.data || [],
    isLoading: getPlans.isLoading,
    createPlan,
    updatePlan
  };
};