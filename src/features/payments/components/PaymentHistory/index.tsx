import { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatCurrency } from "@/utils/formatters";
import { usePayments } from "@/features/payments/hooks/usePayments";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { StatusChip } from "@/components/common/StatusChip";
import { ResponsiveDataView } from "@/components/common/ResponsiveDataView";
import { InfoCard } from "@/components/common/InfoCard";
import { Payment } from "../../types";

const paymentMethodLabels: Record<Payment["payment_method"], string> = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
  other: "Otro",
};

interface PaymentHistoryProps {
  memberId: string;
  emptyState?: ReactNode;
}

export const PaymentHistory = ({
  memberId,
  emptyState,
}: PaymentHistoryProps) => {
  const {
    payments = [],
    isLoading = false,
    error = null,
  } = usePayments(memberId);

  if (isLoading) {
    return (
      <LoadingScreen
        fullScreen={false}
        message="Cargando historial de pagos..."
      />
    );
  }

  if (error) {
    return (
      <Typography color="error">
        Error al cargar el historial de pagos
      </Typography>
    );
  }

  const renderMobileItem = (payment: Payment) => (
    <InfoCard
      title={
        <>
          <Typography component="span" sx={{ display: 'inline-block' }}>
            Pagado: {formatCurrency(payment.memberships?.paid_amount || 0)}
          </Typography>
          {payment.memberships?.pending_amount > 0 && (
            <Typography component="span" color="text.secondary" sx={{ ml: 0.5 }}>
              - Pendiente: {formatCurrency(payment.memberships?.pending_amount)}
            </Typography>
          )}
        </>
      }
      subtitle={
        <>
          <Typography variant="body2" color="text.secondary">
            {format(
              new Date(payment.payment_date || payment.created_at),
              "dd/MM/yyyy",
              { locale: es }
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {paymentMethodLabels[payment.payment_method]}
          </Typography>
          {payment.notes && (
            <Typography variant="body2" color="text.secondary">
              {payment.notes}
            </Typography>
          )}
        </>
      }
      action={<StatusChip status={payment.status} context="payment" />}
    />
  );

  const renderDesktopView = () => (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell>Monto Pagado</TableCell>
            <TableCell>Monto Pendiente</TableCell>
            <TableCell>Método</TableCell>
            <TableCell>Plan</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Notas</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((payment: Payment) => (
            <TableRow key={payment.id}>
              <TableCell>
                {format(
                  new Date(payment.payment_date || payment.created_at),
                  "dd/MM/yyyy",
                  { locale: es }
                )}
              </TableCell>
              <TableCell>
                {formatCurrency(payment.memberships?.paid_amount || 0)}
              </TableCell>
              <TableCell>
                {payment.memberships?.pending_amount > 0
                  ? formatCurrency(payment.memberships?.pending_amount)
                  : "-"}
              </TableCell>
              <TableCell>
                {paymentMethodLabels[payment.payment_method]}
              </TableCell>
              <TableCell>
                {payment.memberships?.membership_plans?.name || "-"}
              </TableCell>
              <TableCell>
                <StatusChip status={payment.status} context="payment" />
              </TableCell>
              <TableCell>{payment.notes || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <ResponsiveDataView
      data={payments}
      renderMobileItem={renderMobileItem}
      renderDesktopView={renderDesktopView}
      emptyState={emptyState}
    />
  );
};
