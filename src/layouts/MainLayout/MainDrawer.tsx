import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import { 
  Home, 
  People, 
  FitnessCenter, 
  Settings,
  FileDownload as DownloadIcon 
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/lib/constants/routes";
import { useMemberStore } from "@/features/shared/stores/memberStore";
import { exportToCsv } from "@/features/members/utils/exportToCsv";

interface MainDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const MainDrawer = ({ open, onClose }: MainDrawerProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { members } = useMemberStore();

  const menuItems = [
    { text: "Dashboard", icon: <Home />, path: ROUTES.DASHBOARD },
    { text: "Members", icon: <People />, path: ROUTES.MEMBERS },
    { text: "Access", icon: <FitnessCenter />, path: ROUTES.ACCESS },
    { text: "Settings", icon: <Settings />, path: ROUTES.SETTINGS },
  ];

  return (
    <>
      {/* Barra lateral fija para desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            width: 240,
            position: 'fixed',
            height: '100%',
            top: 64,
            boxShadow: 3,
            borderRight: 'none'
          },
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItemButton 
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
          <Divider sx={{ my: 1 }} />
          <ListItemButton onClick={() => exportToCsv(members)}>
            <ListItemIcon>
              <DownloadIcon />
            </ListItemIcon>
            <ListItemText primary="Exportar miembros" />
          </ListItemButton>
        </List>
      </Drawer>

      {/* Barra de navegación inferior para móvil */}
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: { xs: "block", sm: "none" },
          zIndex: 1100,
          boxShadow: 3, // Añadido sombreado
        }}
        elevation={3}
      >
        <BottomNavigation
          value={location.pathname}
          onChange={(_, newPath) => {
            navigate(newPath);
          }}
        >
          {menuItems.map((item) => (
            <BottomNavigationAction
              key={item.text}
              label={item.text}
              icon={item.icon}
              value={item.path}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </>
  );
};
