import { Grid, Paper, Typography } from "@mui/material";
import { CheckInScanner } from "@/features/access/components/CheckInScanner";
import { AccessHistory } from "@/features/access/components/AccessHistory";
import { LoadingButton } from "@/components/common/LoadingButton";
import { useState } from "react";

export const AccessControlPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Aquí podríamos agregar lógica para refrescar datos si es necesario
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <CheckInScanner />
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Historial de accesos
          </Typography>
          <LoadingButton
            variant="outlined"
            onClick={handleRefresh}
            loading={isRefreshing}
            loadingText="Actualizando..."
            sx={{ mb: 2 }}
          >
            Actualizar historial
          </LoadingButton>
          <AccessHistory />
        </Paper>
      </Grid>
    </Grid>
  );
};
