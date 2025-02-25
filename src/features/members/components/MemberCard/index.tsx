import { Typography, Chip, Stack, Box } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  ResponsiveCard,
  ResponsiveCardContent,
} from "@/components/common/ResponsiveCard";
import type { Member } from "@/features/members/types";

interface MemberCardProps {
  member: Member;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const MemberCard = ({ member, onEdit, onDelete }: MemberCardProps) => {
  return (
    <ResponsiveCard
      actions={[
        {
          label: "Editar",
          icon: <EditIcon fontSize="small" sx={{ mt: 0.5 }} />,
          onClick: () => onEdit(member.id),
        },
        {
          label: "Eliminar",
          icon: <DeleteIcon fontSize="small" sx={{ mt: 0.5 }} />,
          onClick: () => onDelete(member.id),
        },
      ]}
    >
      <ResponsiveCardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {member.first_name} {member.last_name}
            </Typography>
            <Chip
              label={member.status === "active" ? "Activo" : "Inactivo"}
              size="small"
              sx={{
                backgroundColor: member.status === "active" 
                  ? "rgba(84, 214, 44, 0.16)"
                  : "rgba(255, 72, 66, 0.16)",
                color: member.status === "active" ? "success.main" : "error.main",
                fontWeight: 500,
                fontSize: "0.75rem",
                "& .MuiChip-label": {
                  px: 1.5,
                },
              }}
            />
          </Box>
        </Stack>
      </ResponsiveCardContent>
    </ResponsiveCard>
  );
};
