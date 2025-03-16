import { Box, Stack, Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DashboardCard, MetricValue, MetricLabel } from "../common/DashboardCard";

interface Member {
  first_name: string;
  last_name: string;
}

interface Membership {
  id: string;
  start_date: string;
  end_date: string;
  plan_type: "monthly" | "quarterly" | "annual" | "modify";
  plan_name: string;
  members: Member;
}

interface SupabaseMember {
  first_name: string;
  last_name: string;
}

interface SupabaseMembership {
  id: string;
  start_date: string;
  end_date: string;
  plan_type: string;
  members: SupabaseMember;
  membership_plans: {
    name: string;
  };
}

export const RecentMembershipsCard = () => {
  const { data: memberships, isLoading } = useQuery({
    queryKey: ["recent-memberships"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("memberships")
        .select(
          `
          *,
          members (
            first_name,
            last_name
          )
        `
        )
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <DashboardCard title="Últimas membresías">
        <Stack spacing={2}>
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={60} />
          ))}
        </Stack>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Últimas membresías">
      <Stack spacing={2}>
        {memberships && memberships.length > 0 ? (
          memberships.map((membership) => (
            <Box
              key={membership.id}
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: "background.default",
              }}
            >
              <MetricValue sx={{ fontSize: '1.1rem' }}>
                {membership.members?.first_name} {membership.members?.last_name}
              </MetricValue>
              <MetricLabel>
                {format(new Date(membership.created_at), "PPP", { locale: es })}
              </MetricLabel>
            </Box>
          ))
        ) : (
          <MetricLabel>No hay membresías recientes</MetricLabel>
        )}
      </Stack>
    </DashboardCard>
  );
};
