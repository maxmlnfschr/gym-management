import { Typography, Stack } from "@mui/material";
import { useMemberships } from "@/features/memberships/hooks/useMemberships";
import { formatMembershipDate } from "@/utils/dateUtils";
import { StatusChip } from "@/components/common/StatusChip";
import { DataTable } from "@/components/common/DataTable";
import { Membership } from "../../types";
import { getMembershipStatus } from "../../utils/membershipStatus";
import { ResponsiveDataView } from "@/components/common/ResponsiveDataView";

interface MembershipHistoryProps {
  memberId: string;
  emptyState?: React.ReactNode;
}

export const MembershipHistory = ({
  memberId,
  emptyState,
}: MembershipHistoryProps) => {
  const { memberships } = useMemberships(memberId);

  const sortedMemberships = [...memberships].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  }).map((membership, index) => ({
    ...membership,
    status: index > 0 ? 'expired' : membership.status,
    payment_status: membership.payment_status
  }));

  const renderMobileItem = (membership: Membership) => (
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
    </Stack>
  );

  const renderDesktopView = () => (
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
      ]}
      data={sortedMemberships}
      keyExtractor={(membership) => membership.id}
      emptyMessage="No hay historial de membresías"
    />
  );

  return (
    <ResponsiveDataView
      data={sortedMemberships}
      renderMobileItem={renderMobileItem}
      renderDesktopView={renderDesktopView}
      emptyState={emptyState}
    />
  );
};
