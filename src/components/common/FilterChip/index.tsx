import { Chip, ChipProps } from "@mui/material";

interface FilterChipProps extends Omit<ChipProps, 'onClick'> {
  isSelected?: boolean;
  onSelect?: () => void;
}

export const FilterChip = ({ isSelected, onSelect, ...props }: FilterChipProps) => {
  return (
    <Chip
      size="small"
      onClick={onSelect}
      sx={{
        height: '24px',
        fontSize: '0.75rem',
        bgcolor: isSelected ? 'text.primary' : 'grey.100',
        color: isSelected ? 'white' : 'text.primary',
        fontWeight: 500,
        '&:hover': {
          bgcolor: isSelected ? 'text.primary' : 'grey.200',
        },
        ...props.sx
      }}
      {...props}
    />
  );
};