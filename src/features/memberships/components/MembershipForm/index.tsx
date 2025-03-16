import { useState } from "react";
import { Box, Button, Stack, TextField, Paper } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PlanSelector } from "../PlanSelector";
import { MembershipFormData } from "../../types";
import { addMonths } from "date-fns";

interface PaymentOption {
  value: "pending" | "paid";
  label: string;
}

const paymentStatusOptions: PaymentOption[] = [
  { value: "pending", label: "Pendiente" },
  { value: "paid", label: "Pagado" },
];

const paymentMethodOptions = [
  { value: "cash", label: "Efectivo" },
  { value: "card", label: "Tarjeta" },
  { value: "transfer", label: "Transferencia" },
  { value: "other", label: "Otro" },
];

interface MembershipFormProps {
  onSubmit: (
    data: MembershipFormData & {
      payment_method?: "cash" | "card" | "transfer" | "other";
      payment_notes?: string;
    }
  ) => void;
  initialData?: Partial<MembershipFormData>;
}

export const MembershipForm = ({
  onSubmit,
  initialData,
}: MembershipFormProps) => {
  const [selectedPlanId, setSelectedPlanId] = useState(
    initialData?.planId || ""
  );
  const [startDate, setStartDate] = useState<Date | null>(
    initialData?.startDate || new Date()
  );
  const [paymentStatus, setPaymentStatus] = useState(
    initialData?.paymentStatus || "pending"
  );
  const [planType, setPlanType] = useState(initialData?.planType || "monthly");
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card" | "transfer" | "other" | ""
  >("");
  const [paymentNotes, setPaymentNotes] = useState("");

  const handlePlanSelect = (
    planId: string,
    type: "monthly" | "quarterly" | "annual" | "modify"
  ) => {
    setSelectedPlanId(planId);
    setPlanType(type);
  };

  const handleSubmit = () => {
    if (!startDate || !selectedPlanId) return;

    const localDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );

    onSubmit({
      planId: selectedPlanId,
      startDate: localDate,
      paymentStatus,
      planType,
      ...(paymentStatus === "paid" &&
        paymentMethod && {
          payment_method: paymentMethod,
          payment_notes: paymentNotes,
        }),
    });
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Stack spacing={3}>
        <PlanSelector
          selectedPlan={selectedPlanId}
          onPlanSelect={(planId, type) => handlePlanSelect(planId, type)}
        />

        <DatePicker
          label="Fecha de inicio"
          value={startDate}
          onChange={(newValue: Date | null) => {
            if (newValue) {
              const localDate = new Date(
                newValue.getFullYear(),
                newValue.getMonth(),
                newValue.getDate()
              );
              setStartDate(localDate);
            } else {
              setStartDate(null);
            }
          }}
          slotProps={{
            textField: {
              fullWidth: true,
            },
          }}
          format="dd/MM/yyyy"
        />

        <TextField
          select
          label="Estado de pago"
          value={paymentStatus}
          onChange={(e) =>
            setPaymentStatus(e.target.value as "pending" | "paid")
          }
          fullWidth
          SelectProps={{
            native: true,
          }}
        >
          {paymentStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>

        {paymentStatus === "paid" && (
          <>
            <TextField
              select
              label="Método de pago"
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(
                  e.target.value as "cash" | "card" | "transfer" | "other"
                )
              }
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
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
              onChange={(e) => setPaymentNotes(e.target.value)}
              fullWidth
              multiline
              rows={2}
            />
          </>
        )}

        <Button
          variant="contained"
          onClick={handleSubmit}
          fullWidth
          disabled={paymentStatus === "paid" && !paymentMethod}
        >
          Guardar membresía
        </Button>
      </Stack>
    </Paper>
  );
};
