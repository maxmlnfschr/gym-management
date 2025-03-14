import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Skeleton,
} from "@mui/material";
import { useFinanceMetrics } from "@/features/memberships/hooks/useFinanceMetrics";
import { formatCurrency } from "@/utils/formatters";

export const FinanceMetricsCard = () => {
  const { data: metrics, isLoading } = useFinanceMetrics();

  if (isLoading || !metrics) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Finanzas
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Box>
            <Box>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Finanzas
        </Typography>

        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" component="div">
              {formatCurrency(metrics.currentMonthIncome)}
            </Typography>
            <Typography color="text.secondary" variant="subtitle1">
              Ingresos del mes
            </Typography>
          </Box>

          <Box>
            <Typography variant="h4" component="div" color="warning.main">
              {formatCurrency(metrics.pendingAmount)}
            </Typography>
            <Typography color="text.secondary" variant="subtitle1">
              Pagos pendientes ({metrics.pendingPayments})
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
