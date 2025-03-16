import {
  Box,
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
import { DashboardCard, MetricValue, MetricLabel, MetricContainer } from "../common/DashboardCard";

export const DailyActivityCard = () => {
  const { data: metrics, isLoading } = useCheckInMetrics();

  if (isLoading || !metrics) {
    return (
      <DashboardCard title="Actividad reciente">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="rectangular" height={100} />
      </DashboardCard>
    );
  }

  const percentageChange = metrics.percentageChange;
  const isPositiveChange = percentageChange > 0;

  return (
    <DashboardCard title="Actividad reciente">
      <MetricContainer>
        <MetricValue>{metrics?.todayCount ?? 0}</MetricValue>
        <MetricLabel>Accesos hoy</MetricLabel>
      </MetricContainer>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 2 }}>
        {isPositiveChange ? <TrendingUp color="success" /> : <TrendingDown color="error" />}
        <MetricLabel color={isPositiveChange ? "success.main" : "error.main"}>
          {Math.abs(percentageChange).toFixed(1)}% vs ayer
        </MetricLabel>
      </Box>

      <MetricLabel>Últimos accesos</MetricLabel>
      <List dense>
        {metrics.todayCheckIns.length > 0 ? (
          metrics.todayCheckIns.slice(0, 5).map((checkIn, index) => {
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
    </DashboardCard>
  );
};
