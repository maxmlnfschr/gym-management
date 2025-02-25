import { Chip, ChipProps } from "@mui/material";

interface StatusChipProps extends Omit<ChipProps, 'label'> {
  status: 'active' | 'inactive' | 'deleted';
}

export const StatusChip = ({ status, ...props }: StatusChipProps) => {
  return (
    <Chip
      label={
        status === 'active' ? 'Activo' : 
        status === 'inactive' ? 'Inactivo' : 
        'Eliminado'
      }
      size="small"
      sx={{
        height: '24px',
        fontSize: '0.75rem',
        bgcolor: status === 'active' ? '#0070F3' : 
                status === 'inactive' ? '#F81CE5' : 
                '#666666',
        color: 'white',
        fontWeight: 500,
        ...props.sx
      }}
      {...props}
    />
  );
};