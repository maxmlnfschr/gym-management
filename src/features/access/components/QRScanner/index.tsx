import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Box, Paper, Typography, Button } from "@mui/material";

interface QRScannerProps {
  onScanSuccess: (memberId: string) => void;
  onScanError?: (error: string) => void;
}

export const QRScanner = ({ onScanSuccess, onScanError }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [status, setStatus] = useState<string>("");
  const qrRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    qrRef.current = new Html5Qrcode("qr-reader");

    return () => {
      if (qrRef.current?.isScanning) {
        qrRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startScanning = async () => {
    if (!qrRef.current) return;

    try {
      setStatus("Solicitando acceso a la cámara...");
      await qrRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 300, height: 300 },
        },
        (decodedText) => {
          setStatus("¡QR detectado!");
          onScanSuccess(decodedText);
        },
        (errorMessage) => {
          setStatus("Escaneando...");
          onScanError?.(errorMessage);
        }
      );
      setIsScanning(true);
      setStatus("Escaneando...");
    } catch (err) {
      setStatus("Error: Por favor, permite el acceso a la cámara");
      console.error(err);
    }
  };

  const stopScanning = async () => {
    if (!qrRef.current?.isScanning) return;

    try {
      await qrRef.current.stop();
      setIsScanning(false);
      setStatus("");
    } catch (err) {
      console.error(err);
    }
  };
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !qrRef.current) return;

    try {
      setStatus("Analizando imagen...");
      const result = await qrRef.current.scanFile(file, true);
      setStatus("¡QR detectado!");
      onScanSuccess(result);
    } catch (err) {
      setStatus("No se pudo detectar un código QR en la imagen");
      console.error(err);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: "background.default",
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          id="qr-reader"
          sx={{
            width: "100%",
            aspectRatio: "1/1",
            borderRadius: 2,
            overflow: "hidden",
            position: "relative",
            border: "1px solid",
            borderColor: "divider",
          }}
        />
        {status && (
          <Typography color="text.secondary" align="center">
            {status}
          </Typography>
        )}
        <Box sx={{ 
              display: "flex", 
              gap: 2,
              width: '100%',
            }}>
              <Button
                variant="contained"
                onClick={isScanning ? stopScanning : startScanning}
                fullWidth
              >
                {isScanning ? "Detener Escaneo" : "Usar Cámara"}
              </Button>
              <Button 
                variant="outlined" 
                component="label"
                fullWidth
              >
                Subir Imagen
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </Button>
            </Box>
      </Box>
    </Paper>
  );
};
