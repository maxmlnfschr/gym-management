import { Card, CardContent, Typography, Box, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from "@mui/material";

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
  const { data: recentMemberships, isLoading } = useQuery<Membership[]>({
    queryKey: ["recent-memberships"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("memberships")
        .select(
          `
          id,
          start_date,
          end_date,
          plan_type,
          membership_plans (
            name
          ),
          members (
            first_name,
            last_name
          )
        `
        )
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;

      // Safely transform the data with proper type casting
      const typedData = data as unknown as SupabaseMembership[];
      return typedData.map((membership) => ({
        id: membership.id,
        start_date: membership.start_date,
        end_date: membership.end_date,
        plan_type: membership.plan_type as
          | "monthly"
          | "quarterly"
          | "annual"
          | "modify",
        plan_name: membership.membership_plans?.name || "",
        members: {
          first_name: membership.members.first_name,
          last_name: membership.members.last_name,
        },
      }));
    },
    refetchInterval: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Últimas membresías
          </Typography>
          {[...Array(5)].map((_, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Últimas membresías
        </Typography>
        <Stack spacing={2}>
          {recentMemberships?.map((membership) => (
            <Box key={membership.id}>
              <Typography variant="subtitle1">
                {membership.members?.first_name} {membership.members?.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {membership.plan_type === "modify" 
                  ? membership.plan_name || "Modificado"
                  : membership.plan_name ||
                    (membership.plan_type === "monthly"
                      ? "Mensual"
                      : membership.plan_type === "quarterly"
                      ? "Trimestral"
                      : membership.plan_type === "annual"
                      ? "Anual"
                      : "Desconocido")}{" "}
                •{" "}
                {format(new Date(membership.start_date), "d 'de' MMMM, yyyy", {
                  locale: es,
                })}
              </Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};
