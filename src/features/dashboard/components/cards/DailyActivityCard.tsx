import {
  Skeleton,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { useCheckInMetrics } from "@/features/access/hooks/useCheckInMetrics";
import { formatDistanceToNow, format } from "date-fns";
import { es } from "date-fns/locale";
import {
  DashboardCard,
  MetricValue,
  MetricLabel,
  MetricContainer,
} from "../common/DashboardCard";
import { ResponsiveDataView } from "@/components/common/ResponsiveDataView";
import { StatusChip } from "@/components/common/StatusChip";
import { InfoCard } from "@/components/common/InfoCard";

export const DailyActivityCard = () => {
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

  const renderMobileItem = (checkIn: any) => {
    if (!checkIn || !checkIn.member) {
      return null;
    }

    return (
      <InfoCard
        title={`${checkIn.member.first_name} ${checkIn.member.last_name}`}
        subtitle={format(new Date(checkIn.check_in), "dd/MM/yyyy HH:mm", {
          locale: es,
        })}
        action={<StatusChip status="success" customLabel="Permitido" />}
      />
    );
  };

  const renderDesktopView = () => (
    <Stack spacing={2}>
      {metrics.todayCheckIns.slice(0, 1).map((checkIn) => {
        if (!checkIn || !checkIn.member) {
          return null;
        }
        return renderMobileItem(checkIn);
      })}
    </Stack>
  );

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

      <ResponsiveDataView
        data={metrics.todayCheckIns.slice(0, 5)}
        renderMobileItem={renderMobileItem}
        renderDesktopView={renderDesktopView}
        emptyState={
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
        }
      />

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Últimos accesos</DialogTitle>
        {/* También actualizamos el diálogo para mantener consistencia */}
        <DialogContent>
          <Stack spacing={2}>
            {metrics?.todayCheckIns.map((checkIn) => renderMobileItem(checkIn))}
          </Stack>
        </DialogContent>
      </Dialog>
    </DashboardCard>
  );
};
