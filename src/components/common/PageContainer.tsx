import { Box, Container, Typography, styled } from '@mui/material';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  action?: React.ReactNode;
}

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
  flexDirection: 'column',
  gap: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    marginBottom: theme.spacing(4),
  },
}));

export const PageContainer = ({ children, title, action }: PageContainerProps) => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
      {(title || action) && (
        <HeaderContainer>
          {title && (
            <Typography variant="h4" component="h1">
              {title}
            </Typography>
          )}
          {action && <Box>{action}</Box>}
        </HeaderContainer>
      )}
      {children}
    </Container>
  );
};