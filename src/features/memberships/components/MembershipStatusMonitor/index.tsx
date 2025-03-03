import { Alert, AlertTitle, Stack, Tabs, Tab } from "@mui/material";
import { useExpirationNotifications } from "../../hooks/useExpirationNotifications";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Membership } from "../../types";
import { useState } from "react";
import { TabPanel } from "@/components/common/TabPanel";

export const MembershipStatusMonitor = () => {
  const [tabValue, setTabValue] = useState(0);
  const { expiringMemberships, expiredMemberships, isLoading } = useExpirationNotifications();

  // Ordenar las membresías
  const sortedExpired = [...expiredMemberships].sort((a, b) => 
    new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
  );

  const sortedExpiring = [...expiringMemberships].sort((a, b) => 
    new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
  );

  if (isLoading || (expiringMemberships.length === 0 && expiredMemberships.length === 0)) {
    return null;
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  return (
    <Stack spacing={2}>
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        TabIndicatorProps={{
          sx: {
            backgroundColor: tabValue === 0 ? '#f44336' : '#ff9800'
          }
        }}
        sx={{
          '& .MuiTab-root': {
            color: 'text.primary',
            '&.Mui-selected': {
              color: 'text.primary'
            }
          }
        }}
      >
        <Tab label={`Vencidos (${sortedExpired.length})`} />
        <Tab label={`Por vencer (${sortedExpiring.length})`} />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        {sortedExpired.map((membership) => (
          <Alert 
            key={membership.id} 
            severity="error" 
            sx={{ 
              mb: 1,
              backgroundColor: 'rgba(244, 67, 54, 0.08)',
              '& .MuiAlert-icon': {
                color: '#f44336'
              }
            }}
          >
            <AlertTitle>Membresía vencida</AlertTitle>
            {membership.members.first_name} {membership.members.last_name} - Venció hace{" "}
            {formatDistanceToNow(new Date(membership.end_date), { locale: es })}
          </Alert>
        ))}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {sortedExpiring.map((membership) => (
          <Alert 
            key={membership.id} 
            severity="warning"
            sx={{ 
              mb: 1,
              backgroundColor: 'rgba(255, 152, 0, 0.08)',
              '& .MuiAlert-icon': {
                color: '#ff9800'
              }
            }}
          >
            <AlertTitle>Membresía por vencer</AlertTitle>
            {membership.members.first_name} {membership.members.last_name} - Vence en{" "}
            {formatDistanceToNow(new Date(membership.end_date), { locale: es })}
          </Alert>
        ))}
      </TabPanel>
    </Stack>
  );
};
