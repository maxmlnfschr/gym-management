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
import { Toast } from "@/components/common/Toast";

export const MainLayout = () => {
  const {
    isDrawerOpen,
    isDrawerCollapsed,
    toggleDrawerCollapse,
    toggleDrawer,
  } = useUIStore();
  const { toast, hideToast } = useUIStore();
  const location = useLocation();

  const getMaxWidth = () => {
    if (location.pathname === "/members/form") {
      return "sm" as const; // Para formularios pequeños
    }
    return false as const; // Para usar todo el ancho disponible
  };

  const getPageTitle = () => {
    switch (true) {
      case location.pathname === "/" || location.pathname === "/dashboard":
        return "Panel principal";
      case location.pathname === "/members":
        return "Miembros";
      case location.pathname === "/members/add":
        return "Agregar miembro";
      case location.pathname.startsWith("/members/edit/"):
        return "Editar miembro";
      case location.pathname === "/access":
        return "Control de acceso";
      case location.pathname.startsWith("/members/") && location.pathname.endsWith("/membership"):
        return "Gestionar membresía";
      case location.pathname.startsWith("/members/") && location.pathname.endsWith("/payments"):
        return "Pagos del miembro";
      case location.pathname.startsWith("/members/"):
        return "Detalles del miembro";
      case location.pathname === "/settings":
        return "Ajustes";
      case location.pathname === "/settings/general":
        return "Ajustes generales";
      case location.pathname === "/settings/membership-plans":
        return "Planes de membresía";
      case location.pathname === "/test-responsive":
        return "Prueba responsiva";
      default:
        return "";
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Toast state={toast} onClose={hideToast} />

      <AppBar
        position="fixed"
        sx={{
          height: 64,
          display: { xs: "none", sm: "block" }, // Ocultar en móvil
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
              display: { xs: "none", sm: "flex" },
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
      <Toolbar sx={{ display: { xs: "none", sm: "block" } }} />
      <MainDrawer
        open={isDrawerOpen}
        onClose={toggleDrawer}
        isCollapsed={isDrawerCollapsed}
      />
      <Container
        component="main"
        maxWidth={getMaxWidth()}
        sx={{
          flex: 1,
          p: { xs: 2, sm: 3 },
          pt: { xs: 2, sm: 4 },
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2, // Reducido de 3 a 2
          marginLeft: { xs: "auto", sm: isDrawerCollapsed ? "72px" : "240px" },
          width: {
            xs: "100%",
            sm: `calc(100% - ${isDrawerCollapsed ? "72px" : "240px"})`,
          },
          marginBottom: { xs: "56px", sm: 0 },
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Box
          sx={{
            display: { xs: "flex", sm: "none" },
            flexDirection: "column",
            mb: 2, // Cambiado de 1 a 2 para más espacio consistente
            pb: 1,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: "1.35rem",
              fontWeight: 500,
              color: "text.primary",
            }}
          >
            {getPageTitle()}
          </Typography>
        </Box>
        <Outlet />
      </Container>
    </Box>
  );
};
