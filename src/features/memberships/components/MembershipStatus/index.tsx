import { Paper, Typography, Stack, Chip } from "@mui/material";
import { useMemberships } from "@/features/memberships/hooks/useMemberships";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle, Warning, Block } from "@mui/icons-material";
import { formatMembershipDate } from "@/utils/dateUtils";

interface MembershipStatusProps {
  memberId: string;
  variant?: 'default' | 'plain';  // Añadimos esta prop
}

export const MembershipStatus = ({ memberId, variant = 'default' }: MembershipStatusProps) => {
  const { currentMembership, isLoading } = useMemberships(memberId);

  if (isLoading) {
    return null;
  }

  console.log("Current Membership:", {
    membership: currentMembership,
    startDate: currentMembership?.start_date,
    endDate: currentMembership?.end_date,
  });

  const getStatusInfo = () => {
    if (!currentMembership) {
      return {
        label: "Sin membresía activa",
        color: "error" as const,
        icon: <Block />,
      };
    }

    const endDate = new Date(currentMembership.end_date);
    const isExpired = endDate < new Date();
    const isPending = currentMembership.payment_status === "pending";

    if (isExpired || (isPending && endDate < new Date())) {
      return {
        label: "Pago vencido",
        color: "warning" as const,
        icon: <Warning />,
      };
    }

    return {
      label: "Membresía activa",
      color: "success" as const,
      icon: <CheckCircle />,
    };
  };

  const statusInfo = getStatusInfo();

  return variant === 'default' ? (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Chip
          icon={statusInfo.icon}
          label={statusInfo.label}
          color={statusInfo.color}
        />
        {currentMembership && (
          <Typography variant="body2">
            Vence: {formatMembershipDate(currentMembership.end_date)}
          </Typography>
        )}
      </Stack>
    </Paper>
  ) : (
    <Stack direction="row" spacing={2} alignItems="center">
      <Chip
        icon={statusInfo.icon}
        label={statusInfo.label}
        color={statusInfo.color}
      />
      {currentMembership && (
        <Typography variant="body2">
          Vence: {formatMembershipDate(currentMembership.end_date)}
        </Typography>
      )}
    </Stack>
  );
};
