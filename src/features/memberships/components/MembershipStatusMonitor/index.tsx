import { Alert, AlertTitle, Stack, Tabs, Tab, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";
import { useExpirationNotifications } from "../../hooks/useExpirationNotifications";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Membership } from "../../types";
import { useState } from "react";
import { TabPanel } from "@/components/common/TabPanel";

export const MembershipStatusMonitor = () => {
  const [tabValue, setTabValue] = useState(0);
  const { expiringMemberships, expiredMemberships, pendingMemberships, isLoading } = useExpirationNotifications();
  // Ordenar las membresías
  const sortedExpired = [...expiredMemberships].sort((a, b) => 
    new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
  );
  const sortedExpiring = [...expiringMemberships].sort((a, b) => 
    new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
  );
  const sortedPending = [...pendingMemberships].sort((a, b) => 
    new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
  );
  // Cambiar esta condición para que solo retorne null cuando está cargando
  if (isLoading) {
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
            backgroundColor: tabValue === 0 ? '#f44336' : tabValue === 1 ? '#ff9800' : '#9e9e9e'
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
        <Tab label={sortedExpired.length > 0 ? `Vencidos (${sortedExpired.length})` : 'Vencidos'} />
        <Tab label={sortedExpiring.length > 0 ? `Por vencer (${sortedExpiring.length})` : 'Por vencer'} />
        <Tab label={sortedPending.length > 0 ? `Pendientes (${sortedPending.length})` : 'Pendientes'} />
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        {sortedExpired.length > 0 ? (
          <>
            <AlertTitle sx={{ mb: 2 }}>Membresías vencidas</AlertTitle>
            {sortedExpired.map((membership) => (
              <Alert 
                key={membership.id} 
                severity="error" 
                sx={{ mb: 1, backgroundColor: 'rgba(244, 67, 54, 0.08)', '& .MuiAlert-icon': { color: '#f44336' } }}
              >
                <Link to={`/members/${membership.member_id}`} style={{ textDecoration: 'none' }}>
                  <MuiLink component="span" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                    {membership.members.first_name} {membership.members.last_name}
                  </MuiLink>
                </Link>
                {" "}- Venció hace{" "}
                {formatDistanceToNow(new Date(membership.end_date), { locale: es })}
              </Alert>
            ))}
          </>
        ) : (
          <Alert severity="info">No hay membresías vencidas</Alert>
        )}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {sortedExpiring.length > 0 ? (
          <>
            <AlertTitle sx={{ mb: 2 }}>Membresías por vencer</AlertTitle>
            {sortedExpiring.map((membership) => (
              <Alert 
                key={membership.id} 
                severity="warning"
                sx={{ mb: 1, backgroundColor: 'rgba(255, 152, 0, 0.08)', '& .MuiAlert-icon': { color: '#ff9800' } }}
              >
                <Link to={`/members/${membership.member_id}`} style={{ textDecoration: 'none' }}>
                  <MuiLink component="span" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                    {membership.members.first_name} {membership.members.last_name}
                  </MuiLink>
                </Link>
                {" "}- Vence en{" "}
                {formatDistanceToNow(new Date(membership.end_date), { locale: es })}
              </Alert>
            ))}
          </>
        ) : (
          <Alert severity="info">No hay membresías por vencer</Alert>
        )}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {sortedPending.length > 0 ? (
          <>
            <AlertTitle sx={{ mb: 2 }}>Pagos pendientes</AlertTitle>
            {sortedPending.map((membership) => (
              // En cada Alert, modificar la parte del nombre:
              <Alert 
                key={membership.id} 
                severity="info"
                sx={{ 
                  mb: 1,
                  backgroundColor: 'rgba(158, 158, 158, 0.08)',
                  '& .MuiAlert-icon': {
                    color: '#9e9e9e'
                  }
                }}
              >
                <Link 
                  to={`/members/${membership.member_id}`} 
                  style={{ textDecoration: 'none' }}
                >
                  <MuiLink 
                    component="span" 
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {membership.members.first_name} {membership.members.last_name}
                  </MuiLink>
                </Link>
                {" "}- Vence el{" "}
                {formatDistanceToNow(new Date(membership.end_date), { locale: es })}
              </Alert>
            ))}
          </>
        ) : (
          <Alert severity="info">No hay pagos pendientes</Alert>
        )}
      </TabPanel>
    </Stack>
  );
};
