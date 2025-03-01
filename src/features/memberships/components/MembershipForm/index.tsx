import { useState } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PlanSelector } from '../PlanSelector';
import { MembershipFormData, PlanType } from '../../types';
import { addMonths } from 'date-fns';

interface MembershipFormProps {
  onSubmit: (data: MembershipFormData) => void;
  initialData?: Partial<MembershipFormData>;
}

export const MembershipForm = ({ onSubmit, initialData }: MembershipFormProps) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(initialData?.planType || 'monthly');
  const [startDate, setStartDate] = useState<Date | null>(initialData?.startDate || new Date());
  const [paymentStatus, setPaymentStatus] = useState(initialData?.paymentStatus || 'pending');

  const handlePlanSelect = (plan: PlanType) => {
    setSelectedPlan(plan);
  };

  const handleSubmit = () => {
    if (!startDate) return;

    // Crear una nueva fecha usando solo año, mes y día
    const localDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );

    onSubmit({
      planType: selectedPlan,
      startDate: localDate,
      paymentStatus,
    });
  };

  return (
    <Stack spacing={3}>
      <PlanSelector 
        selectedPlan={selectedPlan} 
        onPlanSelect={handlePlanSelect} 
      />

      <DatePicker
        label="Fecha de inicio"
        value={startDate}
        onChange={(newValue: Date | null) => {
          if (newValue) {
            // Asegurarnos de que la fecha se guarde correctamente
            const localDate = new Date(
              newValue.getFullYear(),
              newValue.getMonth(),
              newValue.getDate()
            );
            setStartDate(localDate);
          } else {
            setStartDate(null);
          }
        }}
        slotProps={{
          textField: {
            fullWidth: true,
          },
        }}
        format="dd/MM/yyyy"
      />

      <TextField
        select
        label="Estado de pago"
        value={paymentStatus}
        onChange={(e) => setPaymentStatus(e.target.value as 'pending' | 'paid' | 'overdue')}
        fullWidth
        SelectProps={{
          native: true,
        }}
      >
        <option value="pending">Pendiente</option>
        <option value="paid">Pagado</option>
        <option value="overdue">Vencido</option>
      </TextField>

      <Button 
        variant="contained" 
        onClick={handleSubmit}
        fullWidth
      >
        Guardar Membresía
      </Button>
    </Stack>
  );
};