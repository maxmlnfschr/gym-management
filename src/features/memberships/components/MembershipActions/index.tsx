import { Button, Stack } from "@mui/material";
import { Refresh, Payment } from "@mui/icons-material";
import { useMemberships } from "@/features/memberships/hooks/useMemberships";
import { useNavigate } from "react-router-dom";

interface MembershipActionsProps {
  memberId: string;
}

export const MembershipActions = ({ memberId }: MembershipActionsProps) => {
  const navigate = useNavigate();
  const { currentMembership } = useMemberships(memberId);

  const handleRenew = () => {
    navigate(`/members/${memberId}/membership`, {
      state: { isRenewal: true, previousMembership: currentMembership },
    });
  };

  return (
    <Stack direction="row" spacing={2}>
      <Button
        startIcon={<Refresh />}
        variant="outlined"
        onClick={handleRenew}
        disabled={!currentMembership}
        sx={{ flex: 1 }}
      >
        Renovar
      </Button>
      <Button
        startIcon={<Payment />}
        variant="outlined"
        onClick={() => navigate(`/members/${memberId}/payments`)}
        sx={{ flex: 1 }}
      >
        Ver pagos
      </Button>
    </Stack>
  );
};
