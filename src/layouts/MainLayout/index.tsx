import {
  Box,
  AppBar,
  Toolbar,
  Container,
  IconButton,
  Typography,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Outlet } from "react-router-dom";
import { useUIStore } from "@/features/shared/stores/uiStore";
import { MainDrawer } from "@/layouts/MainLayout/MainDrawer";
import { useLocation } from "react-router-dom";

export const MainLayout = () => {
  const { isDrawerOpen, toggleDrawer } = useUIStore();
  const location = useLocation();

  const getMaxWidth = () => {
    if (location.pathname.includes('/members/add') || 
        location.pathname.includes('/members/edit')) {
      return {
        xs: '100%',
        sm: '600px',  // Ajustado para mantener consistencia con otras vistas en tablet
        md: '600px',  // Mantenemos el ancho controlado en desktop
        lg: '600px'   // Mantenemos el ancho controlado en pantallas grandes
      }
    }
    return {
      xs: '100%',
      sm: '600px',
      md: '900px',
      lg: '1200px'
    }
  };

  const getPageTitle = () => {
    switch (true) {
      case location.pathname === "/" || location.pathname === "/dashboard":
        return "Panel principal";
      case location.pathname === "/members":
        return "Miembros";
      case location.pathname === "/members/add":
        return "Agregar";
      case location.pathname.startsWith("/members/edit/"):
        return "Editar";
      case location.pathname === "/test-responsive":
        return "Prueba responsiva";
      default:
        return "";
    }
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {getPageTitle()}
          </Typography>
        </Toolbar>
      </AppBar>
      <MainDrawer open={isDrawerOpen} onClose={toggleDrawer} />
      <Container 
        component="main" 
        sx={{ 
          flex: 1,
          py: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3 },
          maxWidth: getMaxWidth(),
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2, sm: 3 }
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
};
