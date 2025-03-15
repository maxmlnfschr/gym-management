import { Box, Card, CardContent, Typography, Skeleton } from '@mui/material';
import { useCheckInMetrics } from '@/features/access/hooks/useCheckInMetrics';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

export const DailyActivityCard = () => {
  const { data: metrics, isLoading } = useCheckInMetrics();

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

  const percentageChange = metrics?.percentageChange ?? 0;
  const isPositiveChange = percentageChange > 0;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Actividad Diaria
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="h3" component="div">
            {metrics?.todayCount ?? 0}
          </Typography>
          <Typography color="text.secondary" variant="subtitle1">
            Check-ins hoy
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isPositiveChange ? (
            <TrendingUp color="success" />
          ) : (
            <TrendingDown color="error" />
          )}
          <Typography 
            color={isPositiveChange ? 'success.main' : 'error.main'}
          >
            {Math.abs(percentageChange).toFixed(1)}% vs ayer
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};