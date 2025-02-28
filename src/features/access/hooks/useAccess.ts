import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useAccess = () => {
  const getAccesses = useQuery({
    queryKey: ["accesses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("access_logs")
        .select(`
          *,
          member:members (
            first_name,
            last_name
          )
        `)
        .order("check_in", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return {
    accesses: getAccesses.data || [],
    isLoading: getAccesses.isLoading,
    error: getAccesses.error,
  };
};