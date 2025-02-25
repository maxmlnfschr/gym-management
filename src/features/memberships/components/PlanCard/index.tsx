import { Card, CardContent, Typography, Box } from '@mui/material';
import { PlanType } from '../../types';

interface PlanCardProps {
  type: PlanType;
  price: number;
  selected?: boolean;
  onSelect?: () => void;
}

export const PlanCard = ({ type, price, selected = false, onSelect }: PlanCardProps) => {
  const planInfo = {
    monthly: {
      title: 'Mensual',
      duration: '1 mes',
    },
    quarterly: {
      title: 'Trimestral',
      duration: '3 meses',
    },
    annual: {
      title: 'Anual',
      duration: '12 meses',
    },
  };

  return (
    <Card
      onClick={onSelect}
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        transform: selected ? 'scale(1.02)' : 'none',
        boxShadow: selected ? 8 : 1,
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {planInfo[type].title}
        </Typography>
        <Typography variant="h4" color="primary" gutterBottom>
          ${price}
        </Typography>
        <Typography color="text.secondary">
          Duración: {planInfo[type].duration}
        </Typography>
      </CardContent>
    </Card>
  );
};