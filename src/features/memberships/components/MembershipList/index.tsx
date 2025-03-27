import { Box, Typography, Stack, Card, CardContent, Chip } from "@mui/material";
import { useMemberships } from "@/features/memberships/hooks/useMemberships";
import { useMembershipFilters } from "@/features/memberships/hooks/useMembershipFilters";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface MembershipListProps {
  memberId: string;
}

export const MembershipList = ({ memberId }: MembershipListProps) => {
  const { memberships, isLoading } = useMemberships(memberId);
  const { status, payment, all } = useMembershipFilters(memberships);

  if (isLoading) {
    return <Typography>Cargando membresías...</Typography>;
  }

  if (all.length === 0) {
    return <Typography>No hay membresías registradas</Typography>;
  }

  return (
    <Stack spacing={2}>
      {all.map((membership) => (
        <Card key={membership.id}>
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="h6">
                {membership.plan_name || 
                  (membership.plan_type === "monthly"
                    ? "Mensual"
                    : membership.plan_type === "quarterly"
                    ? "Trimestral"
                    : membership.plan_type === "annual"
                    ? "Anual"
                    : membership.plan_type === "modify"
                    ? "Modificado"
                    : "Desconocido")}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(membership.start_date), "dd/MM/yyyy", {
                    locale: es,
                  })}{" "}
                  -{" "}
                  {format(new Date(membership.end_date), "dd/MM/yyyy", {
                    locale: es,
                  })}
                </Typography>
                <Chip
                  label={
                    membership.payment_status === "paid"
                      ? "Pagado"
                      : membership.payment_status === "pending"
                      ? "Pendiente"
                      : "Vencido"
                  }
                  color={
                    membership.payment_status === "paid"
                      ? "success"
                      : membership.payment_status === "pending"
                      ? "warning"
                      : "error"
                  }
                  size="small"
                />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};
