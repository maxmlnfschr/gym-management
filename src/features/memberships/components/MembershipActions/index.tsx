import { Stack } from "@mui/material";
import { Refresh, Payment } from "@mui/icons-material";
import { LoadingButton } from "@/components/common/LoadingButton";
import { useMemberships } from "@/features/memberships/hooks/useMemberships";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface MembershipActionsProps {
  memberId: string;
}

export const MembershipActions = ({ memberId }: MembershipActionsProps) => {
  const navigate = useNavigate();
  const { currentMembership } = useMemberships(memberId);
  const [isRenewing, setIsRenewing] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleRenew = async () => {
    setIsRenewing(true);
    try {
      navigate(`/members/${memberId}/membership`, {
        state: { isRenewal: true, previousMembership: currentMembership },
      });
    } finally {
      setIsRenewing(false);
    }
  };

  const handleViewPayments = async () => {
    setIsNavigating(true);
    try {
      navigate(`/members/${memberId}/payments`);
    } finally {
      setIsNavigating(false);
    }
  };

  return (
    <Stack direction="row" spacing={2}>
      <LoadingButton
        startIcon={<Refresh />}
        variant="outlined"
        onClick={handleRenew}
        disabled={!currentMembership}
        loading={isRenewing}
        loadingText="Renovando..."
        sx={{ flex: 1 }}
      >
        Renovar
      </LoadingButton>
      <LoadingButton
        startIcon={<Payment />}
        variant="outlined"
        onClick={handleViewPayments}
        loading={isNavigating}
        loadingText="Cargando..."
        sx={{ flex: 1 }}
      >
        Ver pagos
      </LoadingButton>
    </Stack>
  );
};
