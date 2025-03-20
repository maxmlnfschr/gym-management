import { useState, useRef, useEffect } from "react";
import { Box, Paper, Typography, Alert, Button } from "@mui/material";
import { Html5Qrcode } from "html5-qrcode";
import { useToast } from "@/features/shared/hooks/useToast";
import { QRScanner } from "../QRScanner";
import { useCheckIn } from "@/features/access/hooks/useCheckIn";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { CheckInResponse } from "@/features/access/types";

export const CheckInScanner = () => {
  const { success, warning, error: showError } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const { checkIn, isLoading, error: checkInError } = useCheckIn();

  const handleScan = async (memberId: string) => {
    try {
      const response: CheckInResponse = await checkIn(memberId);

      if (response.membership?.status === "last_day") {
        warning("Acceso permitido - Último día", "Tu membresía vence hoy");
      } else if (response.membership?.status === "active") {
        // Convertir las fechas a medianoche en la zona horaria local
        const endDate = new Date(response.membership.end_date);
        const today = new Date();

        // Establecer ambas fechas a medianoche
        endDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        // Agregar 1 al cálculo ya que el día final también cuenta
        const daysLeft = differenceInDays(endDate, today) + 1;

        console.log("Cálculo de días:", {
          endDate: endDate.toISOString(),
          today: today.toISOString(),
          daysLeft,
        });

        if (daysLeft <= 7 && daysLeft > 1) {
          warning(
            "Acceso permitido - Membresía por vencer",
            `Quedan ${daysLeft} días de membresía`
          );
        } else {
          success(
            "Acceso permitido",
            `Membresía activa - Vence en ${daysLeft} días`
          );
        }
      } else {
        showError("Acceso denegado", "Membresía inactiva o vencida");
      }
    } catch (err: any) {
      showError(
        "Acceso denegado",
        err.message || "Error al procesar el acceso"
      );
    }
  };
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Escanear QR
      </Typography>
      <QRScanner onScanSuccess={handleScan} />
      {checkInError && (
        <Alert severity="warning" sx={{ mt: 2 }} variant="outlined">
          {checkInError}
        </Alert>
      )}
    </Paper>
  );
};
