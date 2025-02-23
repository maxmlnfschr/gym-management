import { Box, TextField, Button, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { memberSchema } from '@/features/members/validations/memberSchema';
import type { MemberFormData } from '@/features/members/types';

interface Props {
  onSubmit: (data: MemberFormData) => Promise<void>;
  initialData?: MemberFormData;
}

export const MemberForm = ({ onSubmit, initialData }: Props) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: initialData
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={3}>
        <TextField
          {...register('first_name')}
          label="First Name"
          fullWidth
          error={!!errors.first_name}
          helperText={errors.first_name?.message}
          autoComplete="given-name"
        />
        
        <TextField
          {...register('last_name')}
          label="Last Name"
          fullWidth
          error={!!errors.last_name}
          helperText={errors.last_name?.message}
          autoComplete="family-name"
        />

        <TextField
          {...register('email')}
          label="Email"
          type="email"
          fullWidth
          error={!!errors.email}
          helperText={errors.email?.message}
          autoComplete="email"
        />

        <TextField
          {...register('phone')}
          label="Phone"
          fullWidth
          error={!!errors.phone}
          helperText={errors.phone?.message}
          autoComplete="tel"
        />

        <TextField
          {...register('notes')}
          label="Notes"
          multiline
          rows={4}
          fullWidth
          error={!!errors.notes}
          helperText={errors.notes?.message}
        />

        <Button 
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={isSubmitting}
        >
          {initialData ? 'Update Member' : 'Add Member'}
        </Button>
      </Stack>
    </Box>
  );
};