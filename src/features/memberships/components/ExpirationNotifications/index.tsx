import { Alert, AlertTitle, Stack } from "@mui/material";
import { useExpirationNotifications } from "../../hooks/useExpirationNotifications";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Membership } from "../../types";

export const ExpirationNotifications = () => {
  const { expiringMemberships, isLoading } = useExpirationNotifications();

  if (isLoading || expiringMemberships.length === 0) {
    return null;
  }

  return (
    <Stack 
      spacing={2} 
      sx={{ 
        maxWidth: '100%',
        mx: 'auto',
        '& .MuiAlert-root': {
          mx: 0,
          borderRadius: 1
        }
      }}
    >
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
            width: 'auto',
            margin: '0 !important'
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
