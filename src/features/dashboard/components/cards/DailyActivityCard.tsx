import {
  Box,
  Skeleton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useState } from "react";
import { useCheckInMetrics } from "@/features/access/hooks/useCheckInMetrics";
import { TrendingUp, TrendingDown } from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  DashboardCard,
  MetricValue,
  MetricLabel,
  MetricContainer,
} from "../common/DashboardCard";
import { useTheme, useMediaQuery } from "@mui/material";

export const DailyActivityCard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openDialog, setOpenDialog] = useState(false);
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

  return (
    <DashboardCard
      title="Actividad reciente"
      action={
        <Button
          variant="text"
          color="primary"
          size="small"
          onClick={() => setOpenDialog(true)}
        >
          Ver todos
        </Button>
      }
    >
      <MetricContainer sx={{ mb: 2 }}>
        <MetricValue>{metrics?.todayCount ?? 0}</MetricValue>
        <MetricLabel>Accesos hoy</MetricLabel>
      </MetricContainer>

      <MetricLabel
        sx={{
          mb: 1.5,
          fontSize: "0.95rem",
          fontWeight: 540,
        }}
      >
        Últimos accesos
      </MetricLabel>
      <List dense>
        {metrics.todayCheckIns.length > 0 ? (
          metrics.todayCheckIns
            .slice(0, isMobile ? 5 : 1)
            .map((checkIn, index) => {
              if (!checkIn || !checkIn.member) {
                return null;
              }

              return (
                <Box key={checkIn.id}>
                  <ListItem
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      p: { xs: 1.5, sm: 2 }, // Reducido el padding en móvil
                      mb: index < metrics.todayCheckIns.length - 1 ? 1 : 0,
                    }}
                  >
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
                </Box>
              );
            })
        ) : (
          <ListItem
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            <ListItemText
              primary="No hay accesos hoy"
              secondary="Aún no se han registrado entradas"
            />
          </ListItem>
        )}
      </List>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Actividad del día</DialogTitle>
        <DialogContent>
          <List>
            {metrics?.todayCheckIns.map((checkIn) => (
              <ListItem key={checkIn.id}>
                <ListItemText
                  primary={`${checkIn.member?.first_name || ""} ${
                    checkIn.member?.last_name || ""
                  }`}
                  secondary={formatDistanceToNow(new Date(checkIn.check_in), {
                    addSuffix: true,
                    locale: es,
                  })}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </DashboardCard>
  );
};
