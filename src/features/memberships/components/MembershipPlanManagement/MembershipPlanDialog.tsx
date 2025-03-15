import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useMembershipPlans, MembershipPlan } from '../../hooks/useMembershipPlans';
import { useEffect } from 'react';

interface MembershipPlanDialogProps {
  open: boolean;
  onClose: () => void;
  planId: string | null;
}

export const MembershipPlanDialog = ({
  open,
  onClose,
  planId,
}: MembershipPlanDialogProps) => {
  const { plans, createPlan, updatePlan } = useMembershipPlans();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MembershipPlan>();

  useEffect(() => {
    if (planId) {
      const plan = plans.find((p) => p.id === planId);
      if (plan) {
        reset(plan);
      }
    } else {
      reset({
        name: '',
        duration_months: 1,
        price: 0,
        active: true,
        description: '',
        plan_type: 'monthly', // Añadimos un valor por defecto
      });
    }
  }, [planId, plans, reset]);

  const onSubmit = async (data: MembershipPlan) => {
    try {
      if (planId) {
        await updatePlan.mutateAsync({ ...data, id: planId });
      } else {
        await createPlan.mutateAsync(data);
      }
      onClose();
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {planId ? 'Editar Plan' : 'Nuevo Plan'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre del Plan"
              fullWidth
              {...register('name', { required: 'El nombre es requerido' })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              label="Duración (meses)"
              type="number"
              fullWidth
              {...register('duration_months', {
                required: 'La duración es requerida',
                min: { value: 1, message: 'La duración mínima es 1 mes' },
              })}
              error={!!errors.duration_months}
              helperText={errors.duration_months?.message}
            />
            <TextField
              label="Precio"
              type="number"
              fullWidth
              {...register('price', {
                required: 'El precio es requerido',
                min: { value: 0, message: 'El precio no puede ser negativo' },
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />
            <TextField
              label="Descripción"
              fullWidth
              multiline
              rows={3}
              {...register('description')}
            />
            <FormControlLabel
              control={
                <Switch
                  {...register('active')}
                  defaultChecked
                />
              }
              label="Plan Activo"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};