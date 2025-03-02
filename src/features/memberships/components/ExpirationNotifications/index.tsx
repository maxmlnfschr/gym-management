import { Alert, AlertTitle, Stack } from "@mui/material";
import { useExpirationNotifications } from "../../hooks/useExpirationNotifications";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Membership } from "../../types";

export const ExpirationNotifications = () => {
  const { expiringMemberships, expiredMemberships, isLoading } = useExpirationNotifications();
  if (isLoading || (expiringMemberships.length === 0 && expiredMemberships.length === 0)) {
    return null;
  }
  return (
    <Stack spacing={2}>
      {expiredMemberships.map((membership: Membership & { 
        members: { 
          first_name: string; 
          last_name: string; 
          email: string 
        } 
      }) => (
        <Alert 
          key={membership.id} 
          severity="error" 
          sx={{ 
            backgroundColor: 'rgba(253, 237, 237, 0.8)',
            '& .MuiAlert-icon': {
              color: 'error.main'
            }
          }}
        >
          <AlertTitle>Membresía vencida</AlertTitle>
          {membership.members.first_name} {membership.members.last_name} - Venció hace{" "}
          {formatDistanceToNow(new Date(membership.end_date), { locale: es })}
        </Alert>
      ))}
      {expiringMemberships.map((membership: Membership & { 
        members: { 
          first_name: string; 
          last_name: string; 
          email: string 
        } 
      }) => (
        <Alert 
          key={membership.id} 
          severity="warning" 
          sx={{ 
            backgroundColor: 'rgba(255, 244, 229, 0.8)',
            '& .MuiAlert-icon': {
              color: 'warning.main'
            }
          }}
        >
          <AlertTitle>Membresía por vencer</AlertTitle>
          {membership.members.first_name} {membership.members.last_name} - Vence
          en{" "}
          {formatDistanceToNow(new Date(membership.end_date), { locale: es })}
        </Alert>
      ))}
    </Stack>
  );
};
