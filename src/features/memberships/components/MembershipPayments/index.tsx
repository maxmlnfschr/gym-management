import { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
} from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatCurrency } from '@/utils/formatters';

interface Payment {
  id: string;
  amount: number;
  payment_date: string;
  payment_method: 'cash' | 'card' | 'transfer' | 'other';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  notes?: string;
}

const paymentMethodLabels = {
  cash: 'Efectivo',
  card: 'Tarjeta',
  transfer: 'Transferencia',
  other: 'Otro'
};

const statusLabels = {
  completed: 'Completado',
  pending: 'Pendiente',
  failed: 'Fallido',
  refunded: 'Reembolsado'
};

interface MembershipPaymentsProps {
  payments: Payment[];
  isLoading?: boolean;
}

export const MembershipPayments = ({ payments, isLoading }: MembershipPaymentsProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return <Typography>Cargando pagos...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Historial de Pagos
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Método</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Notas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {format(new Date(payment.payment_date), 'dd/MM/yyyy', { locale: es })}
                  </TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>{paymentMethodLabels[payment.payment_method]}</TableCell>
                  <TableCell>{statusLabels[payment.status]}</TableCell>
                  <TableCell>{payment.notes || '-'}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={payments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
        />
      </TableContainer>
    </Box>
  );
};