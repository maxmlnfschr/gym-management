import { ReactNode, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
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
import { Collapse, IconButton } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

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
  const { payments = [], isLoading = false, error = null } = usePayments(memberId);
  const [expandedPayments, setExpandedPayments] = useState<string[]>([]);

  const handleExpand = (paymentId: string) => {
    setExpandedPayments((prev: string[]) => 
      prev.includes(paymentId) 
        ? prev.filter((id: string) => id !== paymentId)
        : [...prev, paymentId]
    );
  };

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
    <>
      <InfoCard
        title={
          <>
            <Typography component="span" sx={{ display: 'inline-block', mb: 1 }}>
              Monto total: {formatCurrency(payment.memberships?.membership_plans?.price || 0)}
            </Typography>
            <Typography component="span" sx={{ display: 'block', color: 'success.main' }}>
              Pagado: {formatCurrency(payment.memberships?.paid_amount || 0)}
            </Typography>
            <Typography component="span" sx={{ display: 'block', color: 'warning.main' }}>
              Pendiente: {formatCurrency(payment.memberships?.pending_amount || 0)}
            </Typography>
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
        action={
          <StatusChip status={payment.status} context="payment" />
        }
      />
      {(payment.related_transactions?.length ?? 0) > 0 && expandedPayments.includes(payment.id) && (
        <Box sx={{ ml: 2, mt: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Pagos relacionados
          </Typography>
          {payment.related_transactions?.map((transaction) => (
            <InfoCard
              key={transaction.id}
              title={formatCurrency(transaction.amount)}
              subtitle={
                <>
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(transaction.created_at), "dd/MM/yyyy", { locale: es })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {paymentMethodLabels[transaction.payment_method]}
                  </Typography>
                </>
              }
              action={<StatusChip status={transaction.status} context="payment" />}
            />
          ))}
        </Box>
      )}
    </>
  );

  const renderDesktopView = () => (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox" />
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
            <>
              <TableRow key={payment.id}>
                <TableCell padding="checkbox">
                  {(payment.related_transactions?.length ?? 0) > 0 && (
                    <IconButton size="small" onClick={() => handleExpand(payment.id)}>
                      {expandedPayments.includes(payment.id) ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  )}
                </TableCell>
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
                <TableCell>{paymentMethodLabels[payment.payment_method]}</TableCell>
                <TableCell>{payment.memberships?.membership_plans?.name || "-"}</TableCell>
                <TableCell>
                  <StatusChip status={payment.status} context="payment" />
                </TableCell>
                <TableCell>{payment.notes || "-"}</TableCell>
              </TableRow>
              {(payment.related_transactions?.length ?? 0) > 0 && (
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={expandedPayments.includes(payment.id)} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 2, backgroundColor: 'background.default' }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Pagos relacionados
                        </Typography>
                        <Table size="small">
                          <TableBody>
                            {payment.related_transactions?.map((transaction) => (
                              <TableRow key={transaction.id}>
                                <TableCell>
                                  {format(new Date(transaction.created_at), "dd/MM/yyyy", { locale: es })}
                                </TableCell>
                                <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                                <TableCell>{paymentMethodLabels[transaction.payment_method]}</TableCell>
                                <TableCell>
                                  <StatusChip status={transaction.status} context="payment" />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              )}
            </>
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
