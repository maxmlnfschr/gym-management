import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { PlanType } from '../types';

export interface MembershipPlan {
  id: string;
  name: string;
  duration_months: number;
  price: number;
  active: boolean;
  description?: string;
  features?: string[];
  plan_type: PlanType;  // Añadimos el nuevo campo
}

export interface CreateMembershipPlanData {
  name: string;
  duration_months: number;
  price: number;
  description?: string;
  features?: string[];
  plan_type: PlanType;  // Añadimos el nuevo campo
}

export const useMembershipPlans = () => {
  const queryClient = useQueryClient();

  const { data: plans, isLoading } = useQuery<MembershipPlan[]>({
    queryKey: ['membership-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('membership_plans')
        .select('*')
        .order('duration_months');

      if (error) throw error;
      return data;
    },
  });

  const createPlan = useMutation({
    mutationFn: async (data: CreateMembershipPlanData) => {
      const { data: newPlan, error } = await supabase
        .from('membership_plans')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return newPlan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership-plans'] });
    },
  });

  const updatePlan = useMutation({
    mutationFn: async (data: MembershipPlan) => {
      const { id, ...updateData } = data;
      const { data: updatedPlan, error } = await supabase
        .from('membership_plans')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedPlan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership-plans'] });
    },
  });

  return {
    plans: plans || [],
    isLoading,
    createPlan,
    updatePlan,
  };
};