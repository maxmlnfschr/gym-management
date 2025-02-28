import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Member } from "@/features/members/types";

export const useMember = (id?: string) => {
  const queryClient = useQueryClient();
  
  const getMember = useQuery({
    queryKey: ["member", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Member;
    },
    enabled: !!id,
  });

  const deleteMember = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("members")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });

  return {
    member: getMember.data,
    isLoading: getMember.isLoading,
    deleteMember: deleteMember.mutateAsync,
  };
};
