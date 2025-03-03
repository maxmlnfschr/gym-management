import { Paper, Typography, Stack, Chip } from "@mui/material";
import { useMemberships } from "@/features/memberships/hooks/useMemberships";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle, Warning, Block } from "@mui/icons-material";
import { formatMembershipDate } from "@/utils/dateUtils";
import { getMembershipStatus } from "../../utils/membershipStatus";

interface MembershipStatusProps {
  memberId: string;
  variant?: 'default' | 'plain' | 'chip-only';  // Añadimos la nueva variante
}

export const MembershipStatus = ({ memberId, variant = 'default' }: MembershipStatusProps) => {
  const { currentMembership, isLoading } = useMemberships(memberId);
  if (isLoading) return null;
  const { status, color, severity } = getMembershipStatus(currentMembership);
  const getIcon = () => {
    switch (severity) {
      case 'success':
        return <CheckCircle />;
      case 'warning':
        return <Warning />;
      case 'error':
        return <Block />;
      default:
        return <Block />;
    }
  };
  const chipContent = (
    <Chip
      icon={getIcon()}
      label={status}
      sx={{
        backgroundColor: variant === 'plain' ? 'transparent' : `${color}15`,
        color: color,
        border: variant === 'plain' ? `1px solid ${color}` : 'none',
        '& .MuiChip-icon': {
          color: 'inherit'
        }
      }}
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
    return chipContent;  // Solo retornamos el chip
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
