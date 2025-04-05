import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Paper,
  Typography,
  Stack,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import { PaymentForm } from "../components/PaymentForm";
import { formatCurrency } from "@/utils/formatters";
import { usePayments } from "../hooks/usePayments";

interface FormData {
  payment_method: "" | "cash" | "card" | "transfer" | "other";
  payment_notes: string;
}

export const NewPayment = () => {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"error" | "success">(
    "success"
  );
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { membership, isPendingPayment } = location.state || {};
  const { createPayment } = usePayments(membership?.member_id);

  const [paymentData, setPaymentData] = useState<FormData>({
    payment_method: "transfer",
    payment_notes: "",
  });

  const handlePaymentChange = (data: FormData) => {
    setPaymentData(data);
  };

  const showMessage = (message: string, severity: "error" | "success") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setShowAlert(true);
  };

  const handleSubmit = async () => {
    if (!paymentData.payment_method) {
      showMessage("Selecciona un método de pago", "error");
      return;
    }

    try {
      await createPayment.mutateAsync({
        membership_id: membership.id,
        amount: membership.pending_amount,
        payment_method: paymentData.payment_method,
        notes: paymentData.payment_notes,
        status: "paid",
      });
      showMessage("Pago registrado exitosamente", "success");
      navigate(-1);
    } catch (error) {
      console.error("Error al registrar el pago:", error);
      showMessage("Error al registrar el pago", "error");
    }
  };

  if (!membership) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography color="error">
          No se encontró la información de la membresía
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h6">Registrar Pago</Typography>

          <Stack spacing={2}>
            <Typography variant="subtitle1">
              Plan: {membership?.membership_plans?.name}
            </Typography>
            <Typography color="warning.main" fontWeight="medium">
              Monto a pagar: {formatCurrency(membership?.pending_amount)}
            </Typography>
          </Stack>

          <PaymentForm onPaymentChange={handlePaymentChange} />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={createPayment.isPending}
            >
              {createPayment.isPending ? "Registrando..." : "Registrar Pago"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}
      >
        <Alert onClose={() => setShowAlert(false)} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
