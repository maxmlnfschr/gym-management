import { Stack, Skeleton } from "@mui/material";
import { useFinanceMetrics } from "@/features/memberships/hooks/useFinanceMetrics";
import { formatCurrency } from "@/utils/formatters";
import {
  DashboardCard,
  MetricValue,
  MetricLabel,
  MetricContainer,
} from "../common/DashboardCard";

export const FinanceMetricsCard = () => {
  const { data: metrics, isLoading, error } = useFinanceMetrics();

  console.log("Finance Metrics:", { metrics, isLoading, error }); // Add this line for debugging

  if (isLoading || !metrics) {
    return (
      <DashboardCard title="Finanzas">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="rectangular" height={60} />
      </DashboardCard>
    );
  }

  if (error) {
    console.error("Finance metrics error:", error);
    return (
      <DashboardCard title="Finanzas">
        <MetricLabel color="error">
          Error al cargar métricas financieras
        </MetricLabel>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Finanzas">
      <Stack spacing={2}>
        <MetricContainer>
          <MetricValue>
            {formatCurrency(metrics.currentMonthIncome)}
          </MetricValue>
          <MetricLabel>Ingresos del mes</MetricLabel>
        </MetricContainer>

        <MetricContainer>
          <MetricValue color="warning.main">
            {formatCurrency(metrics.pendingAmount)}
          </MetricValue>
          <MetricLabel>
            Pagos pendientes ({metrics.pendingPayments})
          </MetricLabel>
        </MetricContainer>
      </Stack>
    </DashboardCard>
  );
};
