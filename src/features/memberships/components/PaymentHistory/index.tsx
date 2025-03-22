import { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatCurrency } from '@/utils/formatters';
import { useMembershipPayments } from '@/features/memberships/hooks/useMembershipPayments';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { StatusChip } from '@/components/common/StatusChip';
import { ResponsiveDataView } from '@/components/common/ResponsiveDataView';
import { InfoCard } from "@/components/common/InfoCard";

const paymentMethodLabels: Record<Payment['payment_method'], string> = {
  cash: 'Efectivo',
  card: 'Tarjeta',
  transfer: 'Transferencia',
  other: 'Otro'
};

interface Payment {
  id: string;
  amount: number;
  payment_method: 'cash' | 'card' | 'transfer' | 'other';
  payment_date?: string;
  created_at: string;
  status: 'paid' | 'pending';
  notes?: string;
  memberships?: {
    plan_name?: string;
  };
}

interface PaymentHistoryProps {
  memberId: string;
  emptyState?: ReactNode;
}

export const PaymentHistory = ({ memberId, emptyState }: PaymentHistoryProps) => {
  const { payments, isLoading, error } = useMembershipPayments(memberId);

  if (isLoading) {
    return <LoadingScreen fullScreen={false} message="Cargando historial de pagos..." />;
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
      title={formatCurrency(payment.amount)}
      subtitle={
        <>
          <Typography variant="body2" color="text.secondary">
            {format(new Date(payment.payment_date || payment.created_at), 'dd/MM/yyyy', { locale: es })}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {paymentMethodLabels[payment.payment_method]}
            {payment.memberships?.plan_name && ` - ${payment.memberships.plan_name}`}
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
            <TableCell>Monto</TableCell>
            <TableCell>Método</TableCell>
            <TableCell>Plan</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Notas</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(payments as Payment[]).map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>
                {format(new Date(payment.payment_date || payment.created_at), 'dd/MM/yyyy', { locale: es })}
              </TableCell>
              <TableCell>{formatCurrency(payment.amount)}</TableCell>
              <TableCell>{paymentMethodLabels[payment.payment_method]}</TableCell>
              <TableCell>{payment.memberships?.plan_name || '-'}</TableCell>
              <TableCell>
                <StatusChip status={payment.status} context="payment" />
              </TableCell>
              <TableCell>{payment.notes || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <ResponsiveDataView
      data={payments || []}
      renderMobileItem={renderMobileItem}
      renderDesktopView={renderDesktopView}
      emptyState={emptyState}
    />
  );
};