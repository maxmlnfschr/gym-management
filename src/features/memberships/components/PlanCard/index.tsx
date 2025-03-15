import { Card, CardContent, Typography, Box } from '@mui/material';
import { formatCurrency } from '@/utils/formatters';

interface PlanCardProps {
  name: string;
  price: number;
  duration: number;
  selected?: boolean;
  onSelect?: () => void;
}

export const PlanCard = ({ name, price, duration, selected = false, onSelect }: PlanCardProps) => {
  return (
    <Card
      onClick={onSelect}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.15s ease-out',
        transform: selected ? 'scale(1.01)' : 'none',
        boxShadow: selected ? 3 : 1,
        '&:hover': {
          boxShadow: 2,
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {name}
        </Typography>
        <Typography variant="h4" component="div" gutterBottom>
          {formatCurrency(price)}
        </Typography>
        <Typography color="text.secondary">
          {duration} {duration === 1 ? 'mes' : 'meses'}
        </Typography>
      </CardContent>
    </Card>
  );
};