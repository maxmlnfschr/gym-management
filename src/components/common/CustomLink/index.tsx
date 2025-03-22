import { Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface CustomLinkProps {
  to: string;
  children: React.ReactNode;
  color?: "primary" | "inherit" | "secondary";
  variant?: "body1" | "body2" | "subtitle1" | "subtitle2";
}

export const CustomLink = ({ to, children, color = "primary", variant = "body2" }: CustomLinkProps) => {
  return (
    <MuiLink
      component={RouterLink}
      to={to}
      color={color}
      variant={variant}
      sx={{
        textDecoration: 'underline',
        '&:hover': {
          textDecoration: 'underline',
          opacity: 0.8,
        },
      }}
    >
      {children}
    </MuiLink>
  );
};