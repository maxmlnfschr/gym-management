import { Card, CardContent, CardProps, styled } from '@mui/material';

interface ResponsiveCardProps extends CardProps {
  noPadding?: boolean;
}

export const ResponsiveCard = styled(({ noPadding, ...props }: ResponsiveCardProps) => (
  <Card {...props} />
))(({ theme, noPadding }) => ({
  width: '100%',
  marginBottom: theme.spacing(2),
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