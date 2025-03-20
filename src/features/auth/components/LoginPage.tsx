import { Box, TextField, Typography, Link } from "@mui/material";
import { LoadingButton } from "@/components/common/LoadingButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { ROUTES } from "@/lib/constants/routes";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
      <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
        Inicio de sesión
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error === "Invalid login credentials"
            ? "Credenciales inválidas"
            : "Ocurrió un error"}
        </Typography>
      )}

      <TextField
        margin="normal"
        required
        fullWidth
        label="Correo electrónico"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <LoadingButton
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        loading={loading}
        loadingText="Iniciando sesión..."
        disabled={!email || !password}
      >
        Iniciar Sesión
      </LoadingButton>
      <Link href={ROUTES.REGISTER} variant="body2">
        {"¿No tenés una cuenta? Registrate"}
      </Link>
    </Box>
  );
};
