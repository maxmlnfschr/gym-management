import { Typography, Box, useTheme, useMediaQuery, Stack } from "@mui/material";
import { ResponsiveCard, ResponsiveCardContent } from "@/components/common/ResponsiveCard";
import { useMemberships } from "@/features/memberships/hooks/useMemberships";
import { formatMembershipDate } from "@/utils/dateUtils";
import { StatusChip } from "@/components/common/StatusChip";
import { DataTable } from "@/components/common/DataTable";
import { Membership } from "../../types";
import { getMembershipStatus } from "../../utils/membershipStatus";

interface MembershipHistoryProps {
  memberId: string;
  emptyState?: React.ReactNode;
}

// Renombrar el archivo y el componente (mismo contenido, diferente nombre)
export const MembershipHistory = ({
  memberId,
  emptyState,
}: MembershipHistoryProps) => {
  const { memberships } = useMemberships(memberId);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const sortedMemberships = [...memberships].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  }).map((membership, index) => {
    if (index > 0) {
      return {
        ...membership,
        status: 'expired',
        payment_status: membership.payment_status
      };
    }
    return membership;
  });

  if (!memberships || memberships.length === 0) {
    return emptyState || null;
  }

  if (isMobile) {
    return (
      <Stack spacing={2} sx={{ minHeight: '60vh' }}>
        {sortedMemberships.map((membership) => (
          <ResponsiveCard key={membership.id}>
            <ResponsiveCardContent>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1}>
                  <Typography color="text.secondary">Fecha:</Typography>
                  <Typography>
                    {formatMembershipDate(membership.start_date)}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Typography color="text.secondary">Plan:</Typography>
                  <Typography>
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
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Typography color="text.secondary">Período:</Typography>
                  <Typography>
                    {formatMembershipDate(membership.start_date)} -{" "}
                    {formatMembershipDate(membership.end_date)}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography color="text.secondary">Estado:</Typography>
                  <StatusChip 
                    status={membership.status === 'expired' ? 'error' : getMembershipStatus({
                      end_date: membership.end_date,
                      payment_status: membership.payment_status
                    }).severity}
                  />
                </Stack>

                {membership.membership_plans?.description && (
                  <Stack direction="row" spacing={1}>
                    <Typography color="text.secondary">Descripción:</Typography>
                    <Typography sx={{ flex: 1 }}>
                      {membership.membership_plans.description}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </ResponsiveCardContent>
          </ResponsiveCard>
        ))}
      </Stack>
    );
  }

  return (
    <Box sx={{ minHeight: '60vh' }}>
      <DataTable
        columns={[
          {
            id: "date",
            label: "Fecha",
            render: (membership) => formatMembershipDate(membership.start_date),
          },
          {
            id: "plan",
            label: "Plan",
            render: (membership) =>
              membership.plan_name ||
              (membership.plan_type === "monthly"
                ? "Mensual"
                : membership.plan_type === "quarterly"
                ? "Trimestral"
                : membership.plan_type === "annual"
                ? "Anual"
                : membership.plan_type === "modify"
                ? "Modificado"
                : "Desconocido"),
          },
          {
            id: "period",
            label: "Período",
            render: (membership) =>
              `${formatMembershipDate(
                membership.start_date
              )} - ${formatMembershipDate(membership.end_date)}`,
          },
          {
            id: "status",
            label: "Estado",
            render: (membership) => (
              <StatusChip 
                status={membership.status === 'expired' ? 'error' : getMembershipStatus({
                  end_date: membership.end_date,
                  payment_status: membership.payment_status
                }).severity}
              />
            ),
          },
          {
            id: "description",
            label: "Descripción",
            render: (membership) => 
              membership.membership_plans?.description || "-",
          },
        ]}
        data={sortedMemberships}
        keyExtractor={(membership) => membership.id}
        emptyMessage="No hay historial de membresías"
      />
    </Box>
  );
};
