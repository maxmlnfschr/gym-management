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
  Box,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatCurrency } from '@/utils/formatters';
import { useMembershipPayments } from '@/features/memberships/hooks/useMembershipPayments';
import { LoadingScreen } from '@/components/common/LoadingScreen';

// Añadir este import junto a los demás
import { StatusChip } from '@/components/common/StatusChip';

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
  status: 'completed' | 'pending';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  if (!payments || payments.length === 0) {
    return <>{emptyState}</>;
  }

  if (isMobile) {
    return (
      <Stack spacing={2}>
        {(payments as Payment[]).map((payment) => (
          <Paper key={payment.id} sx={{ p: 2 }}>
            <Stack spacing={1}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Fecha
                </Typography>
                <Typography>
                  {format(new Date(payment.payment_date || payment.created_at), 'dd/MM/yyyy', { locale: es })}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Monto
                </Typography>
                <Typography>{formatCurrency(payment.amount)}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Método de pago
                </Typography>
                <Typography>{paymentMethodLabels[payment.payment_method]}</Typography>
              </Box>

              {payment.memberships?.plan_name && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Plan
                  </Typography>
                  <Typography>{payment.memberships.plan_name}</Typography>
                </Box>
              )}

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Estado
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <StatusChip status={payment.status} context="payment" />
                </Box>
              </Box>

              {payment.notes && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Notas
                  </Typography>
                  <Typography>{payment.notes}</Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        ))}
      </Stack>
    );
  }

  // Vista desktop
  return (
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
};