import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
      light: '#171717',
      dark: '#000000',
      contrastText: '#fff',
    },
    secondary: {
      main: '#666666',
      light: '#888888',
      dark: '#444444',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f5f5', // Cambiado de '#fff' a un gris muy suave
      paper: '#ffffff',   // Mantenemos el blanco para las tarjetas
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 16,
          paddingRight: 16,
          "@media (min-width: 600px)": {
            paddingLeft: 24,
            paddingRight: 24,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 48,
          borderRadius: '6px',
          textTransform: 'none',
          "@media (max-width: 600px)": {
            width: "100%",
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: '#171717',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "@media (max-width: 600px)": {
            fontSize: "16px",
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          paddingTop: 12,
          paddingBottom: 12,
        },
      },
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      "@media (max-width: 600px)": {
        fontSize: "2rem",
      },
    },
    h2: {
      fontSize: "2rem",
      "@media (max-width: 600px)": {
        fontSize: "1.75rem",
      },
    },
    h3: {
      fontSize: "1.75rem",
      "@media (max-width: 600px)": {
        fontSize: "1.5rem",
      },
    },
  },
});