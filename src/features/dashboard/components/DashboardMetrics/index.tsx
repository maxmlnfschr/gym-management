import { Grid } from '@mui/material';
import { DailyActivityCard } from '../cards/DailyActivityCard';
import { MembershipMetricsCard } from '../cards/MembershipMetricsCard';

export const DashboardMetrics = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={4}>
        <DailyActivityCard />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <MembershipMetricsCard />
      </Grid>
    </Grid>
  );
};