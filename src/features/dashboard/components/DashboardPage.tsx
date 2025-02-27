import { Box, Typography, Paper, Grid } from '@mui/material';
import { useAuthStore } from '@/features/shared/stores/authStore';
import { PageContainer } from '@/components/common/PageContainer';
import { ExpirationNotifications } from '@/features/memberships/components/ExpirationNotifications';

export const DashboardPage = () => {
  const { user } = useAuthStore();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            ¡Bienvenido de nuevo!
          </Typography>
          <Box>
            <Typography variant="body1">
              Correo: {user?.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Último ingreso: {new Date(user?.last_sign_in_at || '').toLocaleString()}
            </Typography>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Notificaciones
          </Typography>
          <ExpirationNotifications />
        </Paper>
      </Grid>
    </Grid>
  );
};
