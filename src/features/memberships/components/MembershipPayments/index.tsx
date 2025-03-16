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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  if (isLoading) {
    return <Typography>Cargando pagos...</Typography>;
  }

  if (isMobile) {
    return (
      <Stack spacing={2} sx={{ minHeight: '60vh' }}>
        {payments.map((payment) => (
          <ResponsiveCard key={payment.id}>
            <ResponsiveCardContent>
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
            </ResponsiveCardContent>
          </ResponsiveCard>
        ))}
      </Stack>
    );
  }

  return (
    <Box sx={{ minHeight: '60vh' }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Método</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Notas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {format(new Date(payment.payment_date), "dd/MM/yyyy", {
                      locale: es,
                    })}
                  </TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>
                    {paymentMethodLabels[payment.payment_method]}
                  </TableCell>
                  <TableCell>
                    <StatusChip 
                      status={payment.status} 
                      label={statusLabels[payment.status]}
                      context="payment"
                    />
                  </TableCell>
                  <TableCell>{payment.notes || "-"}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
