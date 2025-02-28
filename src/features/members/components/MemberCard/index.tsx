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
        cursor: "default",
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
            <IconButton
              color="primary"
              onClick={() => navigate(`/members/${member.id}`)}
            >
              <Info />
            </IconButton>
          </Stack>
        </Stack>
      </ResponsiveCardContent>
    </ResponsiveCard>
  );
};
