import { Alert, AlertTitle, Stack } from "@mui/material";
import { useExpirationNotifications } from "../../hooks/useExpirationNotifications";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export const ExpirationNotifications = () => {
  const { expiringMemberships, isLoading } = useExpirationNotifications();

  if (isLoading || expiringMemberships.length === 0) {
    return null;
  }

  return (
    <Stack spacing={2}>
      {expiringMemberships.map((membership) => (
        <Alert key={membership.id} severity="warning" sx={{ width: "100%" }}>
          <AlertTitle>Membresía por vencer</AlertTitle>
          {membership.members.first_name} {membership.members.last_name} - Vence
          en{" "}
          {formatDistanceToNow(new Date(membership.end_date), { locale: es })}
        </Alert>
      ))}
    </Stack>
  );
};
