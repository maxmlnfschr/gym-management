import { Box, Typography, styled } from "@mui/material";
import { ResponsiveCard, ResponsiveCardContent } from "@/components/common/ResponsiveCard";

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

const MetricValue = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 500,
  lineHeight: 1.1,
  marginBottom: '0.1rem',
  height: '1.65rem', // Altura fija para alineamiento
  display: 'flex',
  alignItems: 'center'
}));

const MetricLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.813rem',
  height: '1rem', // Altura fija para alineamiento
  display: 'flex',
  alignItems: 'center'
}));

const MetricContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '3rem', // Altura fija para el contenedor
  justifyContent: 'center'
}));

export const DashboardCard = ({ title, children, action }: DashboardCardProps) => {
  return (
    <ResponsiveCard>
      <ResponsiveCardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="h6" gutterBottom={!action}>
            {title}
          </Typography>
          {action && <Box>{action}</Box>}
        </Box>
        {children}
      </ResponsiveCardContent>
    </ResponsiveCard>
  );
};

export { MetricValue, MetricLabel, MetricContainer };