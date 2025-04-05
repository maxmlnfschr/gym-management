import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Stack,
} from "@mui/material";
import { usePayments } from "../../hooks/usePayments";
import { formatCurrency } from "@/utils/formatters";

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  membershipId: string;
  totalAmount: number;
  paidAmount: number;
  memberId: string;
}

export const PaymentDialog = ({
  open,
  onClose,
  membershipId,
  totalAmount,
  paidAmount,
  memberId,
}: PaymentDialogProps) => {
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "transfer" | "other">("cash");
  const [notes, setNotes] = useState("");
  const { createPartialPayment } = usePayments(memberId);
  const pendingAmount = totalAmount - paidAmount;

  const handleSubmit = async () => {
    try {
      await createPartialPayment.mutateAsync({
        membership_id: membershipId,
        amount: Number(amount),
        payment_method: paymentMethod,
        notes,
        status: Number(amount) >= pendingAmount ? "paid" : "pending",
      });
      onClose();
    } catch (error) {
      console.error("Error al procesar el pago:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Registrar Pago</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <Typography>
            Monto total: {formatCurrency(totalAmount)}
            <br />
            Pagado: {formatCurrency(paidAmount)}
            <br />
            Pendiente: {formatCurrency(pendingAmount)}
          </Typography>
          
          <TextField
            label="Monto a pagar"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            required
          />

          <FormControl fullWidth>
            <InputLabel>Método de pago</InputLabel>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
              label="Método de pago"
            >
              <MenuItem value="cash">Efectivo</MenuItem>
              <MenuItem value="card">Tarjeta</MenuItem>
              <MenuItem value="transfer">Transferencia</MenuItem>
              <MenuItem value="other">Otro</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Notas"
            multiline
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!amount || Number(amount) <= 0 || Number(amount) > pendingAmount}
        >
          Registrar Pago
        </Button>
      </DialogActions>
    </Dialog>
  );
};