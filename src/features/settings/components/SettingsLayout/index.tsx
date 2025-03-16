import { Box, Container, Paper, Typography } from "@mui/material";
import { MembershipPlanManagement } from "@/features/memberships/components/MembershipPlanManagement";

export const SettingsLayout = () => {
  return (
    <Container maxWidth="lg">
      <Box>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Planes de membresía
          </Typography>
          <MembershipPlanManagement />
        </Paper>
      </Box>
    </Container>
  );
};
