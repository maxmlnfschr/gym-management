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
import { Card, CardContent, Box, Avatar } from "@mui/material";
import { MembershipStatus } from "@/features/memberships/components/MembershipStatus";

interface MemberCardProps {
  member: Member;
  onClick?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const MemberCard = ({ member, onClick, onEdit, onDelete }: MemberCardProps) => {
  return (
    <Card 
      onClick={onClick} 
      sx={{ 
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? { bgcolor: 'action.hover' } : {}
      }}
    >
      <CardContent sx={{ pt: 1.5, pb: 2, px: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box>
            <Typography variant="h6" component="div">
              {`${member.first_name} ${member.last_name}`}
            </Typography>
          </Box>
        </Box>
        <MembershipStatus memberId={member.id} variant="plain" />
      </CardContent>
    </Card>
  );
};
