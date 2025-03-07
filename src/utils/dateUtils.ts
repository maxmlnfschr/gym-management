import { format, parseISO, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatMembershipDate = (dateString: string) => {
  const date = parseISO(dateString);
  // Asegurarnos de usar la fecha local sin considerar la zona horaria
  const localDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  return format(localDate, 'dd/MM/yyyy', { locale: es });
};

// Función para determinar el estado de membresía de manera consistente
export const getMembershipStatus = (membership: any) => {
  if (!membership) {
    return {
      status: "no_membership",
      label: "Sin membresía",
      color: "#9e9e9e"
    };
  }

  const today = new Date();
  const endDate = parseISO(membership.end_date);
  const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  // Primero verificamos la fecha de vencimiento (independiente del pago)
  if (endDate < today) {
    return {
      status: "expired",
      label: "Membresía vencida",
      color: "#f44336",
      paymentStatus: membership.payment_status
    };
  }
  
  // Luego verificamos si está por vencer
  if (endDate <= sevenDaysFromNow) {
    return {
      status: "expiring",
      label: "Por vencer",
      color: "#ff9800",
      paymentStatus: membership.payment_status
    };
  }
  
  // Membresía activa (con información de pago separada)
  return {
    status: "active",
    label: "Membresía activa",
    color: "#4caf50",
    paymentStatus: membership.payment_status
  };
};

// Función para formatear fechas relativas para el dashboard
export const formatRelativeDate = (dateString: string): string => {
  const date = parseISO(dateString);
  const today = new Date();
  const diffDays = differenceInDays(date, today);

  if (diffDays < 0) {
    return `Venció el ${format(date, 'dd/MM/yyyy', { locale: es })}`;
  } else if (diffDays === 0) {
    return "Vence hoy";
  } else if (diffDays === 1) {
    return "Vence mañana";
  } else if (diffDays < 7) {
    return `Vence en ${diffDays} días`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Vence en ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `Vence en ${months} ${months === 1 ? 'mes' : 'meses'}`;
  } else {
    return `Vence el ${format(date, 'dd/MM/yyyy', { locale: es })}`;
  }
};