import { Box, Card, CardContent, Typography, Skeleton } from '@mui/material';
import { useMembershipMetrics } from '@/features/memberships/hooks/useMembershipMetrics';
import { People, Warning, ErrorOutline } from '@mui/icons-material';

export const MembershipMetricsCard = () => {
  const { data: metrics, isLoading } = useMembershipMetrics();

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="rectangular" height={100} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Estado de Membresías
        </Typography>
        
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <People color="primary" />
          <Box>
            <Typography variant="h3" component="div">
              {metrics?.activeMembers ?? 0}
            </Typography>
            <Typography color="text.secondary" variant="subtitle1">
              Miembros activos
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning color="warning" />
            <Typography color="warning.main">
              {metrics?.expiringThisWeek ?? 0} membresías vencen esta semana
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ErrorOutline color="error" />
            <Typography color="error">
              {metrics?.expiredMemberships ?? 0} membresías vencidas
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};