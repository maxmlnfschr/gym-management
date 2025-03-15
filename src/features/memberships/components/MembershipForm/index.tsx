import { useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
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

interface MembershipFormProps {
  onSubmit: (data: MembershipFormData) => void;
  initialData?: Partial<MembershipFormData>;
}

export const MembershipForm = ({
  onSubmit,
  initialData,
}: MembershipFormProps) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    initialData?.planId || ""
  );
  const [startDate, setStartDate] = useState<Date | null>(
    initialData?.startDate || new Date()
  );
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "paid">(
    initialData?.paymentStatus || "pending"
  );
  const [planType, setPlanType] = useState<
    "monthly" | "quarterly" | "annual" | "modify"
  >(initialData?.planType || "monthly");

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
      planType, // Añadimos el tipo de plan
    });
  };

  return (
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
            // Asegurarnos de que la fecha se guarde correctamente
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
        onChange={(e) => setPaymentStatus(e.target.value as "pending" | "paid")}
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
      <Button variant="contained" onClick={handleSubmit} fullWidth>
        Guardar Membresía
      </Button>
    </Stack>
  );
};
