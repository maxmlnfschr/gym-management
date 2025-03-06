import { TextField, TextFieldProps, FormHelperText, Box } from "@mui/material";
import { Controller, Control, FieldValues, Path, FieldError } from "react-hook-form";

// Modificamos la interfaz para evitar el conflicto con la propiedad 'error'
interface FormFieldProps<T extends FieldValues> extends Omit<TextFieldProps, 'name' | 'error'> {
  name: Path<T>;
  control: Control<T>;
  error?: FieldError;
}

export function FormField<T extends FieldValues>({
  name,
  control,
  error,
  ...props
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Box mb={2}>
          <TextField
            {...field}
            {...props}
            fullWidth
            error={!!error}
            helperText={error?.message || ""}
            value={field.value || ""}
          />
        </Box>
      )}
    />
  );
}