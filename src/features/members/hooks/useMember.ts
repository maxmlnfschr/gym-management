import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Member } from "@/features/members/types";

export const useMember = (id?: string) => {
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

  return {
    member: getMember.data,
    isLoading: getMember.isLoading,
  };
};
