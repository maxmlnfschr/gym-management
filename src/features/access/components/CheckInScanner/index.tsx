import { useState, useRef, useEffect } from 'react';
import { Box, Paper, Typography, Alert, Button } from '@mui/material';
import { Html5Qrcode } from 'html5-qrcode';
import { useCheckIn } from '../../hooks/useCheckIn';
import { useToast } from '@/features/shared/hooks/useToast';

export const CheckInScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const { checkIn, isLoading, error } = useCheckIn();
  const { showToast } = useToast();

  const startScanner = async () => {
    try {
      const scanner = new Html5Qrcode('reader');
      scannerRef.current = scanner;
      setIsScanning(true);

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText: string) => {
          await handleSuccessfulScan(decodedText);
        },
        (errorMessage: string) => {
          console.log(errorMessage);
        }
      );
    } catch (err) {
      console.error('Error starting scanner:', err);
      showToast('Error al iniciar el scanner', 'error');
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      await scannerRef.current.stop();
      setIsScanning(false);
    }
  };

  const handleSuccessfulScan = async (memberId: string) => {
    try {
      await stopScanner();
      await checkIn(memberId);
      showToast('Check-in exitoso', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error en el check-in', 'error');
    }
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Check-in de Miembros
      </Typography>
      
      <Box sx={{ my: 2, width: '100%', maxWidth: 500, mx: 'auto' }}>
        <div id="reader" style={{ width: '100%' }}></div>
      </Box>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={isScanning ? stopScanner : startScanner}
          color={isScanning ? 'error' : 'primary'}
        >
          {isScanning ? 'Detener Scanner' : 'Iniciar Scanner'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Paper>
  );
};