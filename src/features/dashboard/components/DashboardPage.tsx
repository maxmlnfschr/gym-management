import { Box, Typography, Paper } from '@mui/material';
import { useAuthStore } from '@/features/shared/stores/authStore';
import { PageContainer } from '@/components/common/PageContainer';

export const DashboardPage = () => {
  const { user } = useAuthStore();

  return (
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
  );
};
