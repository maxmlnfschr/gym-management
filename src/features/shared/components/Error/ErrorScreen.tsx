import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ErrorScreenProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorScreen = ({ 
  message = 'Something went wrong', 
  onRetry 
}: ErrorScreenProps) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
        p: 2,
        textAlign: 'center'
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        Oops!
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        {message}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {onRetry && (
          <Button variant="contained" onClick={onRetry}>
            Try Again
          </Button>
        )}
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    </Box>
  );
};