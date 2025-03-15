import { Chip, SxProps, Theme } from "@mui/material";

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  id: string;
  type?: string;  // Añadimos type como prop opcional
  sx?: SxProps<Theme>;
}

export const FilterChip = ({ label, isSelected, onSelect, id, type, sx }: FilterChipProps) => {
  const getChipColor = (filterId: string, isSelected: boolean, type?: string) => {
    if (!isSelected) return { bg: 'grey.300', color: 'text.primary' };

    // Si es un filtro de fecha, usar color negro
    if (type === 'date') {
      return { bg: 'grey.900', color: 'common.white' };
    }

    // Para otros tipos de filtros, mantener la lógica existente
    switch (filterId) {
      case 'active':
        return { bg: 'success.main', color: 'success.contrastText' };
      case 'expiring':
      case 'pending':
        return { bg: 'warning.main', color: 'warning.contrastText' };
      case 'expired':
        return { bg: 'error.main', color: 'error.contrastText' };
      case 'no_membership':
        return { bg: 'grey.500', color: 'grey.contrastText' };
      default:
        return { bg: 'primary.main', color: 'primary.contrastText' };
    }
  };

  const colors = getChipColor(id, isSelected, type);

  return (
    <Chip
      label={label}
      onClick={onSelect}
      sx={{
        backgroundColor: colors.bg,
        color: colors.color,
        border: 'none',
        '&:hover': {
          backgroundColor: isSelected ? colors.bg : 'grey.400',
        },
        fontWeight: isSelected ? 500 : 400,
        transition: 'all 0.2s ease-in-out',
        height: '32px',
        fontSize: '0.875rem',
        ...sx  // Combinamos los estilos base con los props sx
      }}
    />
  );
};