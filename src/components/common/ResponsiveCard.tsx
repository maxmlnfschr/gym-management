import { Card, CardContent, CardProps, styled, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { useState, ReactNode } from 'react';

interface MenuAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  color?: string;
}

interface ResponsiveCardProps extends CardProps {
  noPadding?: boolean;
  actions?: MenuAction[];
}

export const ResponsiveCard = styled(({ noPadding, actions, children, ...props }: ResponsiveCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card {...props}>
      {children}
      {actions && actions.length > 0 && (
        <>
          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {actions.map((action, index) => (
              <MenuItem 
                key={index}
                onClick={() => {
                  action.onClick();
                  handleMenuClose();
                }}
                sx={{ color: action.color }}
              >
                {action.icon && <span style={{ marginRight: 8 }}>{action.icon}</span>}
                {action.label}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Card>
  );
})(({ theme, noPadding }) => ({
  width: '100%',
  marginBottom: theme.spacing(2),
  position: 'relative',
  [theme.breakpoints.up('sm')]: {
    borderRadius: theme.shape.borderRadius * 2,
  },
  '& .MuiCardContent-root': {
    padding: noPadding ? 0 : theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      padding: noPadding ? 0 : theme.spacing(3),
    },
  },
}));

export const ResponsiveCardContent = styled(CardContent)(({ theme }) => ({
  '&:last-child': {
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      paddingBottom: theme.spacing(3),
    },
  },
}));