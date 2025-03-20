import { Button, ButtonProps, CircularProgress } from '@mui/material';

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

export const LoadingButton = ({ 
  loading, 
  children, 
  disabled, 
  loadingText,
  ...props 
}: LoadingButtonProps) => {
  return (
    <Button
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <>
          <CircularProgress 
            size={20} 
            color="inherit" 
            sx={{ mr: loadingText ? 1 : 0 }} 
          />
          {loadingText}
        </>
      ) : children}
    </Button>
  );
};