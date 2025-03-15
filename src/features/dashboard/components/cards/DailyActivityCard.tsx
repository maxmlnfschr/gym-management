import {
  Box,
  Card,
  CardContent,
  Typography,
  Skeleton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useCheckInMetrics } from "@/features/access/hooks/useCheckInMetrics";
import { TrendingUp, TrendingDown } from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export const DailyActivityCard = () => {
  const { data: metrics, isLoading } = useCheckInMetrics();

  console.log("Metrics data:", metrics); // Temporal para debug

  if (isLoading || !metrics) {
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

  const percentageChange = metrics.percentageChange;
  const isPositiveChange = percentageChange > 0;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Actividad reciente
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h3" component="div">
            {metrics?.todayCount ?? 0}
          </Typography>
          <Typography color="text.secondary" variant="subtitle1">
            Accesos hoy
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          {isPositiveChange ? (
            <TrendingUp color="success" />
          ) : (
            <TrendingDown color="error" />
          )}
          <Typography color={isPositiveChange ? "success.main" : "error.main"}>
            {Math.abs(percentageChange).toFixed(1)}% vs ayer
          </Typography>
        </Box>

        <Typography variant="subtitle2" gutterBottom>
          Últimos accesos
        </Typography>
        <List dense>
          {metrics.todayCheckIns.length > 0 ? (
            metrics.todayCheckIns.slice(0, 5).map((checkIn, index) => {
              // Verificar si el objeto checkIn y sus propiedades existen
              if (!checkIn || !checkIn.member) {
                return null;
              }

              return (
                <Box key={checkIn.id}>
                  <ListItem>
                    <ListItemText
                      primary={`${checkIn.member.first_name || ""} ${
                        checkIn.member.last_name || ""
                      }`}
                      secondary={formatDistanceToNow(
                        new Date(checkIn.check_in),
                        {
                          addSuffix: true,
                          locale: es,
                        }
                      )}
                    />
                  </ListItem>
                  {index < Math.min(4, metrics.todayCheckIns.length - 1) && (
                    <Divider />
                  )}
                </Box>
              );
            })
          ) : (
            <ListItem>
              <ListItemText
                primary="No hay accesos hoy"
                secondary="Aún no se han registrado entradas"
              />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
};
