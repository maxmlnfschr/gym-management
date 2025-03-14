import { Chip } from "@mui/material";

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  id: string; // Añadimos el id para identificar el tipo de filtro
}

export const FilterChip = ({ label, isSelected, onSelect, id }: FilterChipProps) => {
  const getChipColor = (filterId: string, isSelected: boolean) => {
    if (!isSelected) return { bg: 'grey.300', color: 'text.primary' };

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

  const colors = getChipColor(id, isSelected);

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
      }}
    />
  );
};