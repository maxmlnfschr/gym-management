import { Box, Typography, Paper } from '@mui/material';
import { useAuthStore } from '@/features/shared/stores/authStore';
import { PageContainer } from '@/components/common/PageContainer';

export const DashboardPage = () => {
  const { user } = useAuthStore();

  return (
    <PageContainer title="Dashboard">
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Welcome back!
        </Typography>
        <Box>
          <Typography variant="body1">
            Email: {user?.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last login: {new Date(user?.last_sign_in_at || '').toLocaleString()}
          </Typography>
        </Box>
      </Paper>

      {/* Rest of dashboard content */}
    </PageContainer>
  );
};
