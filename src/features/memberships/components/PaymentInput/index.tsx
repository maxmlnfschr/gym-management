import { useState } from "react";
import {
  Stack,
  TextField,
  Typography,
  Button,
  InputAdornment,
} from "@mui/material";
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
  const [paidAmount, setPaidAmount] = useState<string>("");

  const handlePaidAmountChange = (value: string) => {
    // Asegurarse que el valor no exceda el monto total
    const numericValue = Math.min(parseFloat(value) || 0, totalAmount);
    setPaidAmount(numericValue.toString());

    const newPendingAmount = Math.max(0, totalAmount - numericValue);

    onChange({
      amount: totalAmount,
      pendingAmount: newPendingAmount,
      paidAmount: numericValue,
    });
  };

  const handleMaxClick = () => {
    handlePaidAmountChange(totalAmount.toString());
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
            step: "1",
          },
          endAdornment: (
            <InputAdornment position="end">
              <Button
                size="small"
                onClick={handleMaxClick}
                sx={{ minWidth: "auto", px: 1 }}
              >
                Máx.
              </Button>
            </InputAdornment>
          ),
        }}
      />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontSize: "0.8rem" }}
      >
        Total: {formatCurrency(totalAmount)} | Pendiente:{" "}
        {formatCurrency(totalAmount - (parseFloat(paidAmount) || 0))}
      </Typography>
    </Stack>
  );
};
