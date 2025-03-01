import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Box } from '@mui/material';

interface QRScannerProps {
  onScanSuccess: (memberId: string) => void;
  onScanError?: (error: string) => void;
}

export const QRScanner = ({ onScanSuccess, onScanError }: QRScannerProps) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true
      },
      false
    );

    scannerRef.current.render(
      (decodedText) => {
        onScanSuccess(decodedText);
      },
      (errorMessage) => {
        onScanError?.(errorMessage);
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, []);  // Removemos las dependencias para que solo se ejecute una vez

  return (
    <Box 
      id="qr-reader" 
      sx={{ 
        width: '100%',
        maxWidth: 400,
        margin: '0 auto',
        '& video': { borderRadius: 2 }
      }} 
    />
  );
};