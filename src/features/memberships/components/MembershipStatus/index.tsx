import { Paper, Typography, Stack, Chip, Button } from '@mui/material';
import { useMemberships } from '@/features/memberships/hooks/useMemberships';
import { format, isAfter } from 'date-fns';
import { es } from 'date-fns/locale';
import { CheckCircle, Warning, Block } from '@mui/icons-material';

interface MembershipStatusProps {
  memberId: string;
}

export const MembershipStatus = ({ memberId }: MembershipStatusProps) => {
  const { currentMembership, isLoading } = useMemberships(memberId);

  if (isLoading) {
    return null;
  }

  const getStatusInfo = () => {
    if (!currentMembership) {
      return {
        label: 'Sin membresía activa',
        color: 'error' as const,
        icon: <Block />,
      };
    }

    if (currentMembership.payment_status === 'overdue') {
      return {
        label: 'Pago vencido',
        color: 'warning' as const,
        icon: <Warning />,
      };
    }

    return {
      label: 'Activa',
      color: 'success' as const,
      icon: <CheckCircle />,
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Chip
          icon={statusInfo.icon}
          label={statusInfo.label}
          color={statusInfo.color}
        />
        {currentMembership && (
          <Typography variant="body2">
            Vence: {format(new Date(currentMembership.end_date), 'dd/MM/yyyy', { locale: es })}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};