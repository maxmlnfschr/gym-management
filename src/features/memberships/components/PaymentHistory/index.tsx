import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { useMemberships } from '@/features/memberships/hooks/useMemberships';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PaymentHistoryProps {
  memberId: string;
}

export const PaymentHistory = ({ memberId }: PaymentHistoryProps) => {
  const { memberships } = useMemberships(memberId);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell>Plan</TableCell>
            <TableCell>Período</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {memberships.map((membership) => (
            <TableRow key={membership.id}>
              <TableCell>
                {format(new Date(membership.start_date), 'dd/MM/yyyy', { locale: es })}
              </TableCell>
              <TableCell>
                {membership.plan_type === 'monthly' ? 'Mensual' : 'Anual'}
              </TableCell>
              <TableCell>
                {format(new Date(membership.start_date), 'dd/MM/yyyy', { locale: es })} - {format(new Date(membership.end_date), 'dd/MM/yyyy', { locale: es })}
              </TableCell>
              <TableCell>
                <Chip
                  label={membership.payment_status === 'paid' ? 'Pagado' : membership.payment_status === 'pending' ? 'Pendiente' : 'Vencido'}
                  color={membership.payment_status === 'paid' ? 'success' : membership.payment_status === 'pending' ? 'warning' : 'error'}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};