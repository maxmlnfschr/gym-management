import { Grid, Typography, Box } from '@mui/material';
import { PlanCard } from '../PlanCard';
import { useMembershipPlans } from '../../hooks/useMembershipPlans';
import { CircularProgress } from '@mui/material';

interface PlanSelectorProps {
  selectedPlan?: string;
  onPlanSelect: (planId: string) => void;
}

export const PlanSelector = ({ selectedPlan, onPlanSelect }: PlanSelectorProps) => {
  const { plans, isLoading } = useMembershipPlans();

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Seleccionar Plan
      </Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {plans.map((plan) => (
          <Grid item xs={12} sm={4} key={plan.id}>
            <PlanCard
              name={plan.name}
              price={plan.price}
              duration={plan.duration_months}
              selected={selectedPlan === plan.id}
              onSelect={() => onPlanSelect(plan.id)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};