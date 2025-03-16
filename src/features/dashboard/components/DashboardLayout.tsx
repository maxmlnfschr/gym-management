import { Grid, Box } from "@mui/material";
import { DailyActivityCard } from "./cards/DailyActivityCard";
import { MembershipMetricsCard } from "./cards/MembershipMetricsCard";
import { FinanceMetricsCard } from "./cards/FinanceMetricsCard";
import { RecentMembershipsCard } from "./cards/RecentMembershipsCard";

export const DashboardLayout = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Grid 
        container 
        spacing={{ xs: 2, sm: 2, md: 2 }}  // Reducido el espaciado en todos los breakpoints
        sx={{
          width: '100%',
          margin: 0,
        }}
      >
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