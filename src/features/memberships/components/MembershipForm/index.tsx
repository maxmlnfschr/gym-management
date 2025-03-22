import { useState } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Paper,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PlanSelector } from "../PlanSelector";
import { MembershipFormData } from "../../types";
import { addMonths } from "date-fns";
import { LoadingButton } from "@/components/common/LoadingButton";
import { PaymentForm } from "@/features/payments/components/PaymentForm";
import { CustomLink } from "@/components/common/CustomLink";
import { useEffect } from "react";

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
  onSubmit: (data: MembershipFormData & {
    payment_method?: "cash" | "card" | "transfer" | "other";
    payment_notes?: string;
  }) => Promise<void>;
  initialData?: Partial<MembershipFormData>;
  isEmbedded?: boolean;
  onDataChange?: (data: MembershipFormData & {
    payment_method?: "cash" | "card" | "transfer" | "other";
    payment_notes?: string;
  }) => void;
}

export const MembershipForm = ({
  onSubmit,
  initialData,
  isEmbedded = false,
  onDataChange
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
  >("transfer");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlanSelect = (
    planId: string,
    type: "monthly" | "quarterly" | "annual" | "modify"
  ) => {
    setSelectedPlanId(planId);
    setPlanType(type);
  };

  const handleSubmit = async () => {
    if (!startDate || !selectedPlanId) return;

    try {
      setIsSubmitting(true);
      const localDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      );

      await onSubmit({
        planId: selectedPlanId,
        startDate: localDate,
        paymentStatus,
        planType,
        payment_method: paymentMethod || "other",
        payment_notes: paymentNotes,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isEmbedded && startDate && selectedPlanId && onDataChange) {
      const localDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      );

      onDataChange({
        planId: selectedPlanId,
        startDate: localDate,
        paymentStatus,
        planType,
        payment_method: paymentMethod || "other",
        payment_notes: paymentNotes,
      });
    }
  }, [selectedPlanId, startDate, paymentStatus, planType, paymentMethod, paymentNotes, onDataChange, isEmbedded]);

  const handlePaymentChange = ({
    payment_method,
    payment_notes,
  }: {
    payment_method: typeof paymentMethod;
    payment_notes: string;
  }) => {
    setPaymentMethod(payment_method);
    setPaymentNotes(payment_notes);
  };

  const content = (
    <Stack spacing={3}>
      <PlanSelector
        selectedPlan={selectedPlanId}
        onPlanSelect={(planId, type) => handlePlanSelect(planId, type)}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <CustomLink to="/settings/membership-plans" color="primary">
          Configurar planes
        </CustomLink>
      </Box>

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
        SelectProps={{ native: true }}
      >
        {paymentStatusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </TextField>

      <PaymentForm
        onPaymentChange={handlePaymentChange}
        initialMethod="transfer"
        initialNotes={paymentNotes}
      />

      {!isEmbedded && (
        <LoadingButton
          variant="contained"
          onClick={handleSubmit}
          fullWidth
          loading={isSubmitting}
          loadingText="Guardando..."
        >
          Guardar membresía
        </LoadingButton>
      )}
    </Stack>
  );

  return isEmbedded ? (
    content
  ) : (
    <Paper
      elevation={1}
      sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, bgcolor: "background.paper" }}
    >
      {content}
    </Paper>
  );
};
