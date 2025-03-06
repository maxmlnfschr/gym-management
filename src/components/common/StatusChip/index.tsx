import { Chip, ChipProps } from "@mui/material";

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'default';

interface StatusChipProps extends Omit<ChipProps, 'color'> {
  status: StatusType | string;
  customLabel?: string;
}

export const StatusChip = ({ status, customLabel, ...props }: StatusChipProps) => {
  const getStatusConfig = (status: string): { color: StatusType, label: string } => {
    switch (status) {
      case 'active':
      case 'paid':
      case 'allowed':
      case 'success':
        return { color: 'success', label: customLabel || 'Activo' };
      case 'pending':
        return { color: 'warning', label: customLabel || 'Pendiente' };
      case 'overdue':
      case 'expired':
      case 'denied':
      case 'error':
        return { color: 'error', label: customLabel || 'Vencido' };
      case 'inactive':
        return { color: 'default', label: customLabel || 'Inactivo' };
      default:
        return { color: 'default', label: customLabel || status };
    }
  };

  const { color, label } = getStatusConfig(status);

  return (
    <Chip
      label={label}
      color={color as ChipProps['color']}
      size="small"
      {...props}
    />
  );
};