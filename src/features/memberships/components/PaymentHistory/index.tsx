import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, useTheme, useMediaQuery } from '@mui/material';
import { useMemberships } from '@/features/memberships/hooks/useMemberships';
import { formatMembershipDate } from '@/utils/dateUtils';
import { StatusChip } from '@/components/common/StatusChip';
import { DataTable } from "@/components/common/DataTable";

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
            <StatusChip status={membership.payment_status} context="payment" />
          </Paper>
        ))}
      </Box>
    );
  }

  // Reemplazar la tabla existente con:
  if (!isMobile) {
    return (
      <DataTable
        columns={[
          {
            id: 'date',
            label: 'Fecha',
            render: (membership) => formatMembershipDate(membership.start_date)
          },
          {
            id: 'plan',
            label: 'Plan',
            render: (membership) => (
              membership.plan_type === 'monthly' 
                ? 'Mensual' 
                : membership.plan_type === 'quarterly'
                ? 'Trimestral'
                : 'Anual'
            )
          },
          {
            id: 'period',
            label: 'Período',
            render: (membership) => (
              `${formatMembershipDate(membership.start_date)} - ${formatMembershipDate(membership.end_date)}`
            )
          },
          {
            id: 'status',
            label: 'Estado',
            render: (membership) => (
              <StatusChip status={membership.payment_status} context="payment" />
            )
          }
        ]}
        data={sortedMemberships}
        keyExtractor={(membership) => membership.id}
        emptyMessage="No hay historial de pagos"
      />
    );
  }
};