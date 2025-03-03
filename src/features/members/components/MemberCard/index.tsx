import { Typography, Stack, IconButton, useTheme, useMediaQuery, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from "@mui/material";
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
import { formatMembershipDate } from "@/utils/dateUtils";

interface MemberCardProps {
  member: Member;
  onClick?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const MemberCard = ({ member, onClick, onEdit, onDelete }: MemberCardProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getStatusConfig = () => {
    const membership = member.current_membership;

    if (!membership) {
      return {
        color: "#9e9e9e",
        status: "Sin membresía",
      };
    }

    const today = new Date();
    const endDate = new Date(membership.end_date);
    const sevenDaysFromNow = new Date(
      today.getTime() + 7 * 24 * 60 * 60 * 1000
    );

    if (membership.payment_status === "pending" || endDate < today) {
      return {
        color: "#f44336",
        status: "Membresía vencida",
      };
    }

    if (endDate <= sevenDaysFromNow) {
      return {
        color: "#ff9800",
        status: "Por vencer",
      };
    }

    return {
      color: "#4caf50",
      status: "Membresía activa",
    };
  };

  const { color, status } = getStatusConfig();

  if (isMobile) {
    return (
      <Card 
        onClick={onClick} 
        sx={{ 
          cursor: onClick ? 'pointer' : 'default',
          '&:hover': onClick ? { bgcolor: 'action.hover' } : {},
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            backgroundColor: color,
          }}
        />
        <CardContent sx={{ pt: 1.5, pb: 2, px: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="h6" component="div">
              {`${member.first_name} ${member.last_name}`}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {member.email}
            </Typography>
            {member.phone && (
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {member.phone}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  }
  return (
    <TableRow 
      onClick={onClick}
      sx={{ 
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? { bgcolor: 'action.hover' } : {},
      }}
    >
      <TableCell sx={{ borderLeft: `4px solid ${color}` }}>
        {`${member.first_name} ${member.last_name}`}
      </TableCell>
      <TableCell>{member.email}</TableCell>
      <TableCell>{member.phone || '-'}</TableCell>
      <TableCell>
        <MembershipStatus 
          memberId={member.id}
          variant="chip-only"
        />
      </TableCell>
      <TableCell>
        {member.current_membership ? (
          formatMembershipDate(member.current_membership.end_date)
        ) : (
          '-'
        )}
      </TableCell>
    </TableRow>
  );
};
