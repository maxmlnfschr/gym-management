import { useState } from "react";
import { Stack, TextField, Typography } from "@mui/material";
import { formatCurrency } from "@/utils/format";

interface PaymentInputProps {
  totalAmount: number;
  initialPendingAmount?: number;
  paymentStatus: "pending" | "paid";
  onChange: (values: {
    amount: number;
    pendingAmount: number;
    paidAmount: number;
  }) => void;
}

export const PaymentInput = ({
  totalAmount,
  initialPendingAmount,
  paymentStatus,
  onChange,
}: PaymentInputProps) => {
  const [paidAmount, setPaidAmount] = useState<string>(
    initialPendingAmount ? (totalAmount - initialPendingAmount).toString() : ""
  );

  const handlePaidAmountChange = (value: string) => {
    setPaidAmount(value);
    const numericValue = parseFloat(value) || 0;
    const newPendingAmount = Math.max(0, totalAmount - numericValue);

    onChange({
      amount: totalAmount,
      pendingAmount: newPendingAmount,
      paidAmount: numericValue
    });
  };

  return (
    <Stack spacing={1}>
      <TextField
        label="Monto pagado"
        value={paidAmount}
        onChange={(e) => handlePaidAmountChange(e.target.value)}
        type="number"
        fullWidth
        InputProps={{
          inputProps: { 
            min: 0, 
            max: totalAmount,
            step: "0.01"
          },
        }}
      />
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
        Total: {formatCurrency(totalAmount)} | Pendiente: {formatCurrency(totalAmount - (parseFloat(paidAmount) || 0))}
      </Typography>
    </Stack>
  );
};