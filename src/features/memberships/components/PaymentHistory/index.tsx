import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Box, useTheme, useMediaQuery } from '@mui/material';
import { CheckCircle, Warning } from '@mui/icons-material';
import { useMemberships } from '@/features/memberships/hooks/useMemberships';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { parseISO } from 'date-fns';
import { formatMembershipDate } from '@/utils/dateUtils';

interface PaymentHistoryProps {
  memberId: string;
}

export const PaymentHistory = ({ memberId }: PaymentHistoryProps) => {
  const { memberships } = useMemberships(memberId);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const sortedMemberships = [...memberships].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const renderPaymentChip = (status: string) => {
    const config = {
      paid: {
        color: '#4caf50',
        label: 'Pagado',
        icon: <CheckCircle fontSize="small" />
      },
      pending: {
        color: '#ff9800',
        label: 'Pendiente',
        icon: <Warning fontSize="small" />
      }
    };

    const statusConfig = config[status as keyof typeof config] || config.pending;

    return (
      <Chip
        icon={statusConfig.icon}
        label={statusConfig.label}
        sx={{
          backgroundColor: `${statusConfig.color}15`,
          color: statusConfig.color,
          border: 'none',
          '& .MuiChip-icon': {
            color: 'inherit'
          },
          fontWeight: 500
        }}
        size="small"
      />
    );
  };

  if (isMobile) {
    return (
      <Box>
        {sortedMemberships.map((membership) => (
          <Paper key={membership.id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Fecha: {formatMembershipDate(membership.start_date)}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Plan: {membership.plan_type === 'monthly' 
                ? 'Mensual' 
                : membership.plan_type === 'quarterly'
                ? 'Trimestral'
                : 'Anual'}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Período: {formatMembershipDate(membership.start_date)} - {formatMembershipDate(membership.end_date)}
            </Typography>
            {renderPaymentChip(membership.payment_status)}  {/* Aquí usamos la nueva función */}
          </Paper>
        ))}
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: -2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell>Plan</TableCell>
            <TableCell>Período</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedMemberships.map((membership) => (
            <TableRow key={membership.id}>
              <TableCell sx={{ py: 1 }}>
                {formatMembershipDate(membership.start_date)}
              </TableCell>
              <TableCell sx={{ py: 1 }}>
                {membership.plan_type === 'monthly' 
                  ? 'Mensual' 
                  : membership.plan_type === 'quarterly'
                  ? 'Trimestral'
                  : 'Anual'}
              </TableCell>
              <TableCell sx={{ py: 1 }}>
                {formatMembershipDate(membership.start_date)} - {formatMembershipDate(membership.end_date)}
              </TableCell>
              <TableCell sx={{ py: 1 }}>
                {renderPaymentChip(membership.payment_status)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};