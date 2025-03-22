import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

interface UserAvatarProps {
  firstName: string;
  lastName: string;
  size?: number;
  membershipStatus?: 'active' | 'expired' | 'no_membership';
}

export const UserAvatar = ({ 
  firstName, 
  lastName, 
  size = 40,
  membershipStatus = 'no_membership'
}: UserAvatarProps) => {
  const getInitials = (first: string, last: string) => {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#44b700';  // verde
      case 'expired':
        return '#ff3d00';  // rojo
      default:
        return '#919191';  // gris
    }
  };

  return (
    <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
      sx={{
        '& .MuiBadge-badge': {
          backgroundColor: getBadgeColor(membershipStatus),
          color: getBadgeColor(membershipStatus),
        },
      }}
    >
      <Avatar
        sx={{
          width: size,
          height: size,
          bgcolor: 'primary.main',
          fontSize: size * 0.4,
        }}
      >
        {getInitials(firstName, lastName)}
      </Avatar>
    </StyledBadge>
  );
};