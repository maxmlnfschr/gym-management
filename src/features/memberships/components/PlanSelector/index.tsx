import { Grid, Typography, Box } from '@mui/material';
import { PlanCard } from '../PlanCard';
import { PlanType } from '../../types';

interface PlanSelectorProps {
  selectedPlan?: PlanType;
  onPlanSelect: (plan: PlanType) => void;
}

export const PlanSelector = ({ selectedPlan, onPlanSelect }: PlanSelectorProps) => {
  const plans = [
    { type: 'monthly' as PlanType, price: 5000 },
    { type: 'quarterly' as PlanType, price: 13500 },
    { type: 'annual' as PlanType, price: 48000 },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Seleccionar Plan
      </Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {plans.map((plan) => (
          <Grid item xs={12} sm={4} key={plan.type}>
            <PlanCard
              type={plan.type}
              price={plan.price}
              selected={selectedPlan === plan.type}
              onSelect={() => onPlanSelect(plan.type)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};