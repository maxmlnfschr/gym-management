import { Stack, ListItemText, Button, Dialog, DialogTitle, DialogContent, List, ListItem, Typography, Paper, Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DashboardCard, MetricValue, MetricLabel } from "../common/DashboardCard";
import { useState } from "react";
import { ResponsiveDataView } from "@/components/common/ResponsiveDataView";
import { formatCurrency } from "@/utils/formatters";
import { StatusChip } from "@/components/common/StatusChip";
import { PlanType } from "@/features/memberships/types";

export const RecentMembershipsCard = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const getPlanTypeLabel = (type: PlanType) => {
    const labels: Record<PlanType, string> = {
      monthly: "Mensual",
      quarterly: "Trimestral",
      annual: "Anual",
      modify: "Modificado"
    };
    return labels[type] || "Desconocido";
  };

  const { data: memberships, isLoading } = useQuery({
    queryKey: ["recent-memberships"],
    queryFn: async () => {
      const { data } = await supabase
        .from("memberships")
        .select(`
          *,
          member:members (
            first_name,
            last_name
          ),
          membership_plans (
            name
          )
        `)
        .order("created_at", { ascending: false })
        .limit(5);
      return data;
    },
  });

  const renderMobileItem = (membership: any) => (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box>
        <Typography variant="subtitle1">
          {membership.member?.first_name || ""} {membership.member?.last_name || ""}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {format(new Date(membership.created_at), "dd/MM/yyyy", { locale: es })} {formatCurrency(membership.amount)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {membership.membership_plans?.name || getPlanTypeLabel(membership.plan_type)}
        </Typography>
      </Box>
      <StatusChip 
        status={membership.payment_status} 
        context="payment"
      />
    </Paper>
  );

  const renderDesktopView = () => (
    <Stack spacing={2}>
      {memberships?.slice(0, 1).map((membership) => renderMobileItem(membership))}
    </Stack>
  );

  return (
    <DashboardCard
      title="Membresías recientes"
      action={
        <Button
          variant="text"
          color="primary"
          size="small"
          onClick={() => setOpenDialog(true)}
        >
          Ver todas
        </Button>
      }
    >
      <ResponsiveDataView
        data={memberships || []}
        renderMobileItem={renderMobileItem}
        renderDesktopView={renderDesktopView}
        emptyState={
          <ListItem
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            <ListItemText
              primary="No hay membresías recientes"
              secondary="No se han registrado membresías recientemente"
            />
          </ListItem>
        }
      />

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Membresías recientes</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            {memberships?.map((membership) => renderMobileItem(membership))}
          </Stack>
        </DialogContent>
      </Dialog>
    </DashboardCard>
  );
};
