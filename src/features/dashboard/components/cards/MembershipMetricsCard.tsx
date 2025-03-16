import { Box, Skeleton } from "@mui/material";
import { useMembershipMetrics } from "@/features/memberships/hooks/useMembershipMetrics";
import {
  DashboardCard,
  MetricValue,
  MetricLabel,
  MetricContainer,
} from "../common/DashboardCard";

export const MembershipMetricsCard = () => {
  const { data: metrics, isLoading } = useMembershipMetrics();

  if (isLoading) {
    return (
      <DashboardCard title="Estado de membresías">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="rectangular" height={60} />
      </DashboardCard>
    );
  }

  if (!metrics) {
    return (
      <DashboardCard title="Estado de membresías">
        <MetricLabel color="error">Error al cargar métricas</MetricLabel>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Estado de membresías">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <MetricContainer>
          <MetricValue>{metrics.activeMembers}</MetricValue>
          <MetricLabel>Miembros activos</MetricLabel>
        </MetricContainer>

        <MetricContainer>
          <MetricValue color="warning.main">{metrics.expiringThisWeek}</MetricValue>
          <MetricLabel>membresías vencen esta semana</MetricLabel>
        </MetricContainer>

        <MetricContainer>
          <MetricValue color="error">{metrics.expiredMemberships}</MetricValue>
          <MetricLabel>membresías vencidas</MetricLabel>
        </MetricContainer>
      </Box>
    </DashboardCard>
  );
};
