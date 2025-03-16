import { Grid, Paper, Typography } from "@mui/material";
import { CheckInScanner } from "@/features/access/components/CheckInScanner";
import { AccessHistory } from "@/features/access/components/AccessHistory";

export const AccessControlPage = () => {
  return (
    <Grid container>  {/* Quitado el spacing */}
      <Grid item xs={12} md={6}>
        <CheckInScanner />
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Historial de accesos
          </Typography>
          <AccessHistory />
        </Paper>
      </Grid>
    </Grid>
  );
};
