import { Typography, Stack } from "@mui/material";
import { useMemberships } from "@/features/memberships/hooks/useMemberships";
import { useMembershipFilters } from "@/features/memberships/hooks/useMembershipFilters";
import { formatMembershipDate } from "@/utils/dateUtils";
import { StatusChip } from "@/components/common/StatusChip";
import { DataTable } from "@/components/common/DataTable";
import { Membership } from "../../types";
import { getMembershipStatus } from "../../utils/membershipStatus";
import { ResponsiveDataView } from "@/components/common/ResponsiveDataView";
import { InfoCard } from "@/components/common/InfoCard";
import { getMembershipPlanName } from "../../utils/planUtils";

interface MembershipHistoryProps {
  memberId: string;
  emptyState?: React.ReactNode;
}

export const MembershipHistory = ({
  memberId,
  emptyState,
}: MembershipHistoryProps) => {
  const { memberships } = useMemberships(memberId);
  const { status, payment, all } = useMembershipFilters(memberships);

  const sortedMemberships = [...all]
    .sort((a, b) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    })
    .map((membership, index) => ({
      ...membership,
      status:
        index > 0
          ? "expired"
          : status.expired.includes(membership)
          ? "expired"
          : membership.status,
      payment_status: membership.payment_status,
    }));

  const renderMobileItem = (membership: Membership) => (
    <InfoCard
      title={getMembershipPlanName(membership)}
      subtitle={
        <>
          <Typography variant="body2" color="text.secondary">
            {formatMembershipDate(membership.start_date)} -{" "}
            {formatMembershipDate(membership.end_date)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {membership.membership_plans?.description || "Sin descripción"}
          </Typography>
        </>
      }
      action={
        <StatusChip
          status={
            membership.status === "expired"
              ? "error"
              : getMembershipStatus({
                  end_date: membership.end_date,
                  payment_status: membership.payment_status,
                }).severity
          }
        />
      }
    />
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
          render: (membership) => getMembershipPlanName(membership),
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
              status={
                membership.status === "expired"
                  ? "error"
                  : getMembershipStatus({
                      end_date: membership.end_date,
                      payment_status: membership.payment_status,
                    }).severity
              }
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
