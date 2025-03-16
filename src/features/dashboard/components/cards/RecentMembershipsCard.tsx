import { Box, Stack, Skeleton, ListItemText, Button, Dialog, DialogTitle, DialogContent, List, ListItem } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DashboardCard, MetricValue, MetricLabel } from "../common/DashboardCard";
import { useState } from "react";
import { useTheme, useMediaQuery } from "@mui/material";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openDialog, setOpenDialog] = useState(false);
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
    <DashboardCard
      title="Últimas membresías"
      action={
        <Button 
          variant="text" 
          color="primary" 
          size="small" 
          onClick={() => setOpenDialog(true)}
        >
          Ver todos
        </Button>
      }
    >
      <Stack spacing={2}>
        {memberships?.slice(0, isMobile ? 5 : 2).map((membership) => (
          <Box
            key={membership.id}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              p: { xs: 1.5, sm: 2 },  // Reducido el padding en móvil
            }}
          >
            <ListItemText
              primary={`${membership.members?.first_name} ${membership.members?.last_name}`}
              secondary={format(new Date(membership.created_at), "PPP", {
                locale: es,
              })}
              primaryTypographyProps={{ variant: "body2" }}
              secondaryTypographyProps={{ variant: "caption" }}
            />
          </Box>
        ))}
      </Stack>

      {/* Dialog con la lista completa */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Últimas membresías</DialogTitle>
        <DialogContent>
          <List>
            {memberships?.map((membership) => (
              <ListItem key={membership.id}>
                <ListItemText
                  primary={`${membership.members?.first_name} ${membership.members?.last_name}`}
                  secondary={format(new Date(membership.created_at), "PPP", {
                    locale: es,
                  })}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </DashboardCard>
  );
};
