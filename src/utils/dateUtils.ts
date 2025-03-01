import { format, parseISO } from 'date-fns';
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