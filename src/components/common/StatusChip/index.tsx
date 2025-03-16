import { Chip, ChipProps } from "@mui/material";

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'default';

interface StatusChipProps extends Omit<ChipProps, 'color'> {
  status: StatusType | string;
  customLabel?: string;
  context?: 'membership' | 'payment';
}

export const StatusChip = ({ status, customLabel, context = 'membership', ...props }: StatusChipProps) => {
  const getStatusConfig = (status: string): { color: StatusType, label: string } => {
    // Para estados de pago
    if (context === 'payment') {
      switch (status) {
        case 'paid':
          return { color: 'success', label: customLabel || 'Pagado' };
        case 'pending':
          return { color: 'warning', label: customLabel || 'Pendiente' };
        case 'failed':
          return { color: 'error', label: customLabel || 'Fallido' };
        case 'refunded':
          return { color: 'info', label: customLabel || 'Reembolsado' };
        default:
          return { color: 'default', label: customLabel || status };
      }
    }
    
    // Para estados de membresía (mantener el switch existente)
    switch (status) {
      case 'active':
      case 'allowed':
      case 'success':
        return { color: 'success', label: customLabel || 'Membresía activa' };
      case 'expiring':
      case 'pending':
        return { color: 'warning', label: customLabel || 'Por vencer' };
      case 'expired':
      case 'denied':
      case 'error':
        return { color: 'error', label: customLabel || 'Vencida' };
      case 'no_membership':
        return { color: 'default', label: customLabel || 'Sin membresía' };
      case 'inactive':
        return { color: 'default', label: customLabel || 'Inactiva' };
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