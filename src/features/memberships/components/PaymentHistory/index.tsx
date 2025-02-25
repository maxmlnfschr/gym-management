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
                {format(new Date(membership.startDate), 'dd/MM/yyyy', { locale: es })}
              </TableCell>
              <TableCell>
                {membership.planType === 'monthly' ? 'Mensual' : 'Anual'}
              </TableCell>
              <TableCell>
                {format(new Date(membership.startDate), 'dd/MM/yyyy', { locale: es })} - {format(new Date(membership.endDate), 'dd/MM/yyyy', { locale: es })}
              </TableCell>
              <TableCell>
                <Chip
                  label={membership.paymentStatus === 'paid' ? 'Pagado' : membership.paymentStatus === 'pending' ? 'Pendiente' : 'Vencido'}
                  color={membership.paymentStatus === 'paid' ? 'success' : membership.paymentStatus === 'pending' ? 'warning' : 'error'}
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