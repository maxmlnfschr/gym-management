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
  if (isLoading) return null;
  
  const { status, severity } = getMembershipStatus(currentMembership);
  
  const chipContent = (
    <StatusChip
      status={severity}
      customLabel={status}
      variant={variant === 'plain' ? "outlined" : "filled"}
    />
  );

  if (variant === 'default') {
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          {chipContent}
          {currentMembership && (
            <Typography variant="body2">
              Vence: {formatMembershipDate(currentMembership.end_date)}
            </Typography>
          )}
        </Stack>
      </Paper>
    );
  }

  if (variant === 'chip-only') {
    return chipContent;
  }

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {chipContent}
      {currentMembership && (
        <Typography variant="body2">
          Vence: {formatMembershipDate(currentMembership.end_date)}
        </Typography>
      )}
    </Stack>
  );
};
