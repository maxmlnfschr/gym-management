import { Box, Typography, SxProps, Theme } from "@mui/material";
import { LoadingButton } from "@/components/common/LoadingButton";
import { useState } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void | Promise<void>;
  icon?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export const EmptyState = ({
  title,
  description,
  actionText,
  onAction,
  icon,
  sx
}: EmptyStateProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    if (!onAction) return;
    setIsLoading(true);
    try {
      await onAction();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      p={4}
      sx={sx}
    >
      {icon && <Box mb={2}>{icon}</Box>}
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" mb={2}>
          {description}
        </Typography>
      )}
      {actionText && onAction && (
        <LoadingButton
          variant="contained"
          onClick={handleAction}
          loading={isLoading}
          loadingText="Cargando..."
        >
          {actionText}
        </LoadingButton>
      )}
    </Box>
  );
};