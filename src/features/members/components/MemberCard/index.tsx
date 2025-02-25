import {
  Typography,
  Chip,
  Stack,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import {
  ResponsiveCard,
  ResponsiveCardContent,
} from "@/components/common/ResponsiveCard";
import type { Member } from "@/features/members/types";
import { Card, CardContent } from "@mui/material";
import { useState } from "react";
import { StatusChip } from "@/components/common/StatusChip";

interface MemberCardProps {
  member: Member;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const MemberCard = ({ member, onEdit, onDelete }: MemberCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    id: string
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
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
              size="small"
              onClick={(event) => handleMenuClick(event, member.id)}
            >
              <MoreVertIcon />
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            onEdit(member.id);
            handleClose();
          }}
        >
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Editar
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDelete(member.id);
            handleClose();
          }}
        >
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Eliminar
        </MenuItem>
      </Menu>
    </Card>
  );
};
