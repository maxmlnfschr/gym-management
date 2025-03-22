import { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatCurrency } from "@/utils/formatters";
import { StatusChip } from "@/components/common/StatusChip";
import { DataTable } from "@/components/common/DataTable";
import { ResponsiveDataView } from "@/components/common/ResponsiveDataView";
import { ResponsiveCard, ResponsiveCardContent } from "@/components/common/ResponsiveCard";

interface Payment {
  id: string;
  amount: number;
  payment_date: string;
  payment_method: "cash" | "card" | "transfer" | "other";
  status: "paid" | "pending" | "failed" | "refunded";
  notes?: string;
}

const paymentMethodLabels = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
  other: "Otro",
};

const statusLabels = {
  paid: "Pagado",
  pending: "Pendiente",
  failed: "Fallido",
  refunded: "Reembolsado",
};

interface MembershipPaymentsProps {
  payments: Payment[];
  isLoading?: boolean;
}

export const MembershipPayments = ({
  payments,
  isLoading,
}: MembershipPaymentsProps) => {
  if (isLoading) {
    return <Typography>Cargando pagos...</Typography>;
  }

  const renderMobileItem = (payment: Payment) => (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1}>
        <Typography color="text.secondary">Fecha:</Typography>
        <Typography>
          {format(new Date(payment.payment_date), "dd/MM/yyyy", {
            locale: es,
          })}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1}>
        <Typography color="text.secondary">Monto:</Typography>
        <Typography>{formatCurrency(payment.amount)}</Typography>
      </Stack>

      <Stack direction="row" spacing={1}>
        <Typography color="text.secondary">Método:</Typography>
        <Typography>
          {paymentMethodLabels[payment.payment_method]}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        <Typography color="text.secondary">Estado:</Typography>
        <StatusChip 
          status={payment.status} 
          label={statusLabels[payment.status]}
          context="payment"
        />
      </Stack>

      {payment.notes && (
        <Stack direction="row" spacing={1}>
          <Typography color="text.secondary">Notas:</Typography>
          <Typography>{payment.notes}</Typography>
        </Stack>
      )}
    </Stack>
  );

  const renderDesktopView = () => (
    <DataTable
      columns={[
        {
          id: "date",
          label: "Fecha",
          render: (payment) =>
            format(new Date(payment.payment_date), "dd/MM/yyyy", {
              locale: es,
            }),
        },
        {
          id: "amount",
          label: "Monto",
          render: (payment) => formatCurrency(payment.amount),
        },
        {
          id: "method",
          label: "Método",
          render: (payment) => paymentMethodLabels[payment.payment_method],
        },
        {
          id: "status",
          label: "Estado",
          render: (payment) => (
            <StatusChip 
              status={payment.status} 
              label={statusLabels[payment.status]}
              context="payment"
            />
          ),
        },
        {
          id: "notes",
          label: "Notas",
          render: (payment) => payment.notes || "-",
        },
      ]}
      data={payments}
      keyExtractor={(payment) => payment.id}
      emptyMessage="No hay pagos registrados"
    />
  );

  return (
    <ResponsiveDataView
      data={payments}
      renderMobileItem={renderMobileItem}
      renderDesktopView={renderDesktopView}
      emptyState={
        <Typography color="text.secondary" textAlign="center">
          No hay pagos registrados
        </Typography>
      }
    />
  );
};
