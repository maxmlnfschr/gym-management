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
  const { isDrawerOpen, isDrawerCollapsed, toggleDrawerCollapse, toggleDrawer } = useUIStore();
  const location = useLocation();

  const getMaxWidth = () => {
    if (location.pathname === '/members/form') {  // Cambiado para coincidir con la ruta correcta
      return {
        xs: '100%',
        sm: '400px',
        md: '400px',
        lg: '400px'
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
      <AppBar 
            position="fixed"
            sx={{ 
              height: 64 
            }}
          >
            <Toolbar sx={{ minHeight: 64 }}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ 
                  mr: 2,
                  display: { xs: 'none', sm: 'flex' } // Ocultar en móvil, mostrar en desktop
                }}
                onClick={toggleDrawerCollapse}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {getPageTitle()}
              </Typography>
            </Toolbar>
          </AppBar>
      <Toolbar />
      <MainDrawer open={isDrawerOpen} onClose={toggleDrawer} isCollapsed={isDrawerCollapsed} />
      <Container 
        component="main" 
        sx={{ 
          flex: 1,
          p: 3,  // Cambiado de 2 a 3
          pt: 4,  // Cambiado de 3 a 4 para más espacio arriba
          maxWidth: getMaxWidth(),
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,  // Cambiado de 2 a 3
          marginLeft: { xs: 'auto', sm: isDrawerCollapsed ? '72px' : '240px' },
          width: { xs: '100%', sm: `calc(100% - ${isDrawerCollapsed ? '72px' : '240px'})` },
          marginBottom: { xs: '56px', sm: 0 }
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
};
