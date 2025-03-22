import { Grid, Typography, Box, Theme } from "@mui/material";
import { PlanCard } from "../PlanCard";
import { useMembershipPlans } from "../../hooks/useMembershipPlans";
import { CircularProgress } from "@mui/material";
import { PlanType } from "../../types";

interface PlanSelectorProps {
  selectedPlan: string;
  onPlanSelect: (planId: string, planType: PlanType) => void;
}

export const PlanSelector = ({
  selectedPlan,
  onPlanSelect,
}: PlanSelectorProps) => {
  const { plans, isLoading } = useMembershipPlans();

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Elegir plan
      </Typography>
      <Grid container spacing={2}>
        {plans.map((plan) => (
          <Grid item xs={12} sm={4} key={plan.id}>
            <PlanCard
              name={plan.name}
              price={plan.price}
              duration={plan.duration_months}
              selected={selectedPlan === plan.id}
              description={plan.description}
              onSelect={() => onPlanSelect(plan.id, plan.plan_type)}
              sx={{
                transition: "all 0.2s ease-in-out",
                border: (theme: Theme) =>
                  selectedPlan === plan.id
                    ? `2px solid ${theme.palette.success.main}`
                    : "1px solid rgba(0, 0, 0, 0.12)",
                bgcolor:
                  selectedPlan === plan.id
                    ? "success.lighter"
                    : "background.paper",
                transform:
                  selectedPlan === plan.id ? "scale(1.02)" : "scale(1)",
                "&:hover": {
                  transform: "scale(1.02)",
                  borderColor: "success.main",
                },
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
