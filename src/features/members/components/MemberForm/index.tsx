import { Box, TextField, Button, Stack, Paper } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memberSchema } from "@/features/members/validations/memberSchema";
import type { MemberFormData } from "@/features/members/types";
import { useLocation } from 'react-router-dom';
import { LoadingButton } from "@/components/common/LoadingButton";

interface Props {
  onSubmit: (data: MemberFormData) => Promise<void>;
  initialData?: MemberFormData;
}

export const MemberForm = ({ onSubmit, initialData }: Props) => {
  const location = useLocation();
  const defaultName = location.state?.defaultName || '';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      ...initialData,
      first_name: defaultName || initialData?.first_name || ''
    },
  });
  // Eliminar el useState y formValues que habíamos agregado
  return (
    <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={3}>
          <TextField
            {...register("first_name")}
            id="first-name"
            label="Nombre"
            fullWidth
            error={!!errors.first_name}
            helperText={errors.first_name?.message}
            autoComplete="given-name"
          />

          <TextField
            {...register("last_name")}
            id="last-name"
            label="Apellido"
            fullWidth
            error={!!errors.last_name}
            helperText={errors.last_name?.message}
            autoComplete="family-name"
          />

          <TextField
            {...register("email")}
            id="email"
            label="Correo electrónico"
            type="email"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
            autoComplete="email"
          />

          <TextField
            {...register("phone")}
            id="phone"
            label="Celular"
            fullWidth
            error={!!errors.phone}
            helperText={errors.phone?.message}
            autoComplete="tel"
          />

          <TextField
            {...register("notes")}
            id="notes"
            label="Notas"
            multiline
            rows={4}
            fullWidth
            error={!!errors.notes}
            helperText={errors.notes?.message}
          />

          <LoadingButton
            type="submit"
            variant="contained"
            fullWidth
            loading={isSubmitting}
            loadingText="Guardando..."
          >
            {initialData ? "Actualizar" : "Guardar"}
          </LoadingButton>
        </Stack>
      </Box>
    </Paper>
  );
};
