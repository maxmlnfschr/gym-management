import { Paper, Typography, Stack } from "@mui/material";
import { useMemberships } from "@/features/memberships/hooks/useMemberships";
import { formatMembershipDate } from "@/utils/dateUtils";
import { getMembershipStatus } from "../../utils/membershipStatus";
import { StatusChip } from "@/components/common/StatusChip";

interface MembershipStatusProps {
  memberId: string;
  variant?: 'default' | 'plain' | 'chip-only';
}

export const MembershipStatus = ({ memberId, variant = 'default' }: MembershipStatusProps) => {
  const { currentMembership, isLoading } = useMemberships(memberId);
  
  if (isLoading || !currentMembership) return null;
  
  // Obtener el estado de la membresía usando la función centralizada
  const { status, severity } = getMembershipStatus({
    end_date: currentMembership.end_date,
    payment_status: currentMembership.payment_status
  });
  
  // Crear el chip de estado de membresía
  const membershipChip = (
    <StatusChip
      status={severity}
      customLabel={status}
      variant={variant === 'plain' ? "outlined" : "filled"}
    />
  );
  
  if (variant === 'default') {
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Estado de membresía
        </Typography>
        <Stack direction="row" spacing={1}>
          {membershipChip}
        </Stack>
      </Paper>
    );
  }
  
  return (
    <Stack direction="row" spacing={1}>
      {membershipChip}
    </Stack>
  );
};
