import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import { useMembershipPlans } from "../../hooks/useMembershipPlans";
import { MembershipPlanDialog } from "./MembershipPlanDialog";
import { useState } from "react";
import { formatCurrency } from "@/utils/formatters";
import { getMembershipPlanName } from "../../utils/planUtils";

export const MembershipPlanManagement = () => {
  const { plans, isLoading } = useMembershipPlans();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleAddPlan = () => {
    setSelectedPlan(null);
    setOpenDialog(true);
  };

  const handleEditPlan = (planId: string) => {
    setSelectedPlan(planId);
    setOpenDialog(true);
  };

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">Planes de Membresía</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddPlan}
        >
          Nuevo Plan
        </Button>
      </Stack>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Duración (meses)</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>{plan.name}</TableCell>
                    <TableCell>{plan.duration_months}</TableCell>
                    <TableCell>{formatCurrency(plan.price)}</TableCell>
                    <TableCell>
                      {getMembershipPlanName({
                        membership_plans: { name: plan.name },
                        plan_type: plan.plan_type,
                      })}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEditPlan(plan.id)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <MembershipPlanDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        planId={selectedPlan}
      />
    </Box>
  );
};
