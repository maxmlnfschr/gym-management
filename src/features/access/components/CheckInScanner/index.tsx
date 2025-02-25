import { useState, useRef, useEffect } from 'react';
import { Box, Paper, Typography, Alert, Button } from '@mui/material';
import { Html5Qrcode } from 'html5-qrcode';
import { useToast } from '@/features/shared/hooks/useToast';
import { QRScanner } from '../QRScanner';
import { useCheckIn } from '@/features/access/hooks/useCheckIn';

export const CheckInScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const { checkIn, isLoading, error } = useCheckIn();
  const { showToast } = useToast();

  const handleScan = (memberId: string) => {
    checkIn(memberId);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Escanear QR
      </Typography>
      <QRScanner 
        onScanSuccess={handleScan}
      />
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Paper>
  );
};