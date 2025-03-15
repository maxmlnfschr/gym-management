import { Card, CardContent, Typography } from '@mui/material';

export const GeneralSettings = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Configuración General
        </Typography>
        {/* Aquí irán las configuraciones generales del gimnasio */}
      </CardContent>
    </Card>
  );
};