import { useEffect } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { useAuthStore } from "@/features/shared/stores/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { RecentMembershipsCard } from "./cards/RecentMembershipsCard";
import { DailyActivityCard } from "./cards/DailyActivityCard";
import { MembershipMetricsCard } from "./cards/MembershipMetricsCard";
import { FinanceMetricsCard } from "./cards/FinanceMetricsCard";

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries();
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Sección de bienvenida */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          ¡Bienvenido de nuevo!
        </Typography>
        <Box>
          <Typography variant="body1">Correo: {user?.email}</Typography>
          <Typography variant="body2" color="text.secondary">
            Último ingreso:{" "}
            {new Date(user?.last_sign_in_at || "").toLocaleString()}
          </Typography>
        </Box>
      </Paper>

      {/* Dashboard Cards */}
      <Grid container spacing={{ xs: 1, sm: 1.5 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <DailyActivityCard />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MembershipMetricsCard />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <FinanceMetricsCard />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <RecentMembershipsCard />
        </Grid>
      </Grid>
    </Box>
  );
};
