import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Box, Paper, Typography, Button } from "@mui/material";
import { QrCode2 } from "@mui/icons-material"; // Añadir este import

interface QRScannerProps {
  onScanSuccess: (memberId: string) => void;
  onScanError?: (error: string) => void;
}

export const QRScanner = ({ onScanSuccess, onScanError }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
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
      setUploadedImage(null);
      await qrRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 350 },
          aspectRatio: 1,
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
      // Detener el escaneo si está activo
      if (qrRef.current.isScanning) {
        await qrRef.current.stop();
        setIsScanning(false);
      }

      setStatus("Analizando imagen...");
      setUploadedImage(URL.createObjectURL(file));
      const result = await qrRef.current.scanFile(file, true);
      setStatus("¡QR detectado!");
      onScanSuccess(result);
    } catch (err) {
      setStatus("No se pudo detectar un código QR en la imagen");
      console.error(err);
    }
  };

  // Limpiar la URL cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (uploadedImage) {
        URL.revokeObjectURL(uploadedImage);
      }
    };
  }, [uploadedImage]);

  return (
    <Paper
      elevation={0}
      sx={{ backgroundColor: "background.default", borderRadius: 2 }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box sx={{ width: "100%", position: "relative" }}>
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
          {!isScanning && !uploadedImage && (
            <Box
              sx={{
                position: "absolute",
                top: 1,
                left: 1,
                right: 1,
                bottom: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.paper",
                borderRadius: 1.5,
              }}
            >
              <QrCode2 sx={{ fontSize: 80, mb: 2, color: "text.disabled" }} />
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                sx={{ px: 2 }}
              >
                Presiona "Usar cámara" para escanear un código QR
              </Typography>
            </Box>
          )}
          {uploadedImage && (
            <Box
              component="img"
              src={uploadedImage}
              sx={{
                position: "absolute",
                top: 1,
                left: 1,
                right: 1,
                bottom: 1,
                width: "calc(100% - 2px)",
                height: "calc(100% - 2px)",
                objectFit: "contain",
                borderRadius: 1.5,
              }}
            />
          )}
        </Box>
        {status && (
          <Typography color="text.secondary" align="center">
            {status}
          </Typography>
        )}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: "100%",
          }}
        >
          <Button
            variant="contained"
            onClick={isScanning ? stopScanning : startScanning}
            fullWidth
          >
            {isScanning ? "Detener escaneo" : "Usar cámara"}
          </Button>
          <Button variant="outlined" component="label" fullWidth>
            Subir imagen
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
