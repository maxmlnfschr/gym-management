import { useState } from "react";
import { Stack, TextField } from "@mui/material";

const paymentMethodOptions = [
  { value: "cash", label: "Efectivo" },
  { value: "card", label: "Tarjeta" },
  { value: "transfer", label: "Transferencia" },
  { value: "other", label: "Otro" },
];

interface PaymentFormProps {
  onPaymentChange: (data: {
    payment_method: "cash" | "card" | "transfer" | "other" | "";
    payment_notes: string;
  }) => void;
  initialMethod?: string;
  initialNotes?: string;
}

export const PaymentForm = ({ onPaymentChange, initialMethod = "", initialNotes = "" }: PaymentFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "transfer" | "other" | "">(initialMethod as any);
  const [paymentNotes, setPaymentNotes] = useState(initialNotes);

  const handleMethodChange = (method: typeof paymentMethod) => {
    setPaymentMethod(method);
    onPaymentChange({ payment_method: method, payment_notes: paymentNotes });
  };

  const handleNotesChange = (notes: string) => {
    setPaymentNotes(notes);
    onPaymentChange({ payment_method: paymentMethod, payment_notes: notes });
  };

  return (
    <Stack spacing={2}>
      <TextField
        select
        label="Método de pago"
        value={paymentMethod}
        onChange={(e) => handleMethodChange(e.target.value as typeof paymentMethod)}
        fullWidth
        required
        SelectProps={{
          native: true,
        }}
      >
        <option value="">Seleccionar método</option>
        {paymentMethodOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </TextField>

      <TextField
        label="Notas de pago"
        value={paymentNotes}
        onChange={(e) => handleNotesChange(e.target.value)}
        fullWidth
        multiline
        rows={2}
      />
    </Stack>
  );
};