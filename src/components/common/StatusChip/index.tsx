import { Chip, ChipProps } from "@mui/material";

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'default';

interface StatusChipProps extends Omit<ChipProps, 'color'> {
  status: StatusType | string;
  customLabel?: string;
  context?: 'membership' | 'payment';
}

export const StatusChip = ({ status, customLabel, context = 'membership', ...props }: StatusChipProps) => {
  const getStatusConfig = (status: string): { color: StatusType, label: string } => {
    // Para estados de pago - solo paid y pending
    if (context === 'payment') {
      switch (status) {
        case 'paid':
          return { color: 'success', label: customLabel || 'Pagado' };
        case 'pending':
        default:
          return { color: 'warning', label: customLabel || 'Pendiente' };
      }
    }
    // Para estados de membresía (default)
    switch (status) {
      case 'active':
      case 'allowed':
      case 'success':
        return { color: 'success', label: customLabel || 'Membresía activa' }; // Cambiado de 'Activo' a 'Membresía activa'
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