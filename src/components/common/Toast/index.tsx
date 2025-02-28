import { Alert, Snackbar, Box, Typography } from "@mui/material";
import { ToastState } from "@/features/shared/types/common";

interface ToastProps {
  state: ToastState;
  onClose: () => void;
}

export const Toast = ({ state, onClose }: ToastProps) => {
  return (
    <Snackbar
      open={state.open}
      autoHideDuration={state.duration || 4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert 
        onClose={onClose} 
        severity={state.type}
        variant="filled"
        sx={{ width: '100%' }}
      >
        <Box>
          <Typography variant="body2">{state.message}</Typography>
          {state.details && (
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
              {state.details}
            </Typography>
          )}
        </Box>
      </Alert>
    </Snackbar>
  );
};