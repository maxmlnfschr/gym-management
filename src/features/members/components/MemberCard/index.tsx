import {
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import { Info } from "@mui/icons-material";
import {
  ResponsiveCard,
  ResponsiveCardContent,
} from "@/components/common/ResponsiveCard";
import type { Member } from "@/features/members/types";
import { useNavigate } from "react-router-dom";
import { StatusChip } from "@/components/common/StatusChip";

interface MemberCardProps {
  member: Member;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const MemberCard = ({ member, onEdit, onDelete }: MemberCardProps) => {
  const navigate = useNavigate();

  return (
    <ResponsiveCard
      sx={{
        cursor: "pointer",
        transition: "all 0.15s ease-out",
        "&:hover": {
          boxShadow: (theme) => theme.shadows[2],
          transform: "translateY(-1px)",
        },
      }}
    >
      <ResponsiveCardContent>
        <Stack spacing={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Stack spacing={1}>
              <Typography variant="h6">
                {member.first_name} {member.last_name}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {new Date(member.created_at).toLocaleDateString()} •
                </Typography>
                <StatusChip status={member.status} />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </ResponsiveCardContent>
    </ResponsiveCard>
  );
};
