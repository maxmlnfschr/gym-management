import { Paper, Typography, Stack } from '@mui/material';
import { PaymentHistory } from '../components/PaymentHistory';
import { Payment } from '@mui/icons-material';
import { EmptyState } from '@/components/common/EmptyState';
import { useParams } from 'react-router-dom';

export const MemberPayments = () => {
  const { id } = useParams();

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Historial de Pagos</Typography>
        <PaymentHistory 
          memberId={id!}
          emptyState={
            <EmptyState
              icon={<Payment sx={{ fontSize: 40, color: "text.secondary" }} />}
              title="Sin historial de pagos"
              description="Este miembro aún no tiene registros de pagos"
            />
          }
        />
      </Stack>
    </Paper>
  );
};