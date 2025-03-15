import { useEffect } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { useAuthStore } from "@/features/shared/stores/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { MembershipStatusMonitor } from "@/features/memberships/components/MembershipStatusMonitor";
import { DashboardMetrics } from "./DashboardMetrics";
import { RecentMembershipsCard } from "./cards/RecentMembershipsCard";

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries();
  }, []);

  return (
    <Grid container spacing={3}>
      {/* Sección de bienvenida */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
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
      </Grid>

      {/* Sección de métricas */}
      <Grid item xs={12}>
        <DashboardMetrics />
      </Grid>

      {/* Sección de membresías recientes y monitor de estado */}
      <Grid item xs={12} md={6}>
        <RecentMembershipsCard />
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Estado de Membresías
          </Typography>
          <MembershipStatusMonitor />
        </Paper>
      </Grid>
    </Grid>
  );
};
