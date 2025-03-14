import { Chip } from "@mui/material";

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
}

export const FilterChip = ({ label, isSelected, onSelect }: FilterChipProps) => {
  return (
    <Chip
      label={label}
      onClick={onSelect}
      sx={{
        backgroundColor: isSelected ? 'primary.main' : 'grey.300',
        color: isSelected ? 'primary.contrastText' : 'text.primary',
        border: 'none',
        '&:hover': {
          backgroundColor: isSelected ? 'primary.dark' : 'grey.400',
        },
        fontWeight: isSelected ? 500 : 400,
        transition: 'all 0.2s ease-in-out',
        height: '32px',
        fontSize: '0.875rem',
      }}
    />
  );
};