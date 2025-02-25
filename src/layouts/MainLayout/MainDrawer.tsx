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
  FileDownload as DownloadIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/lib/constants/routes";
import { useMemberStore } from "@/features/shared/stores/memberStore";
import { exportToCsv } from "@/features/members/utils/exportToCsv";
import { useState } from "react";

interface MainDrawerProps {
  open: boolean;
  onClose: () => void;
  isCollapsed: boolean;
}

export const MainDrawer = ({ open, onClose, isCollapsed }: MainDrawerProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { members } = useMemberStore();

  const menuItems = [
    {
      text: "Panel",
      mobileText: "Panel",
      icon: <Home />,
      path: ROUTES.DASHBOARD,
    },
    {
      text: "Miembros",
      mobileText: "Miembros",
      icon: <People />,
      path: ROUTES.MEMBERS,
    },
    {
      text: "Acceso",
      mobileText: "Acceso",
      icon: <FitnessCenter />,
      path: ROUTES.ACCESS,
    },
    {
      text: "Ajustes",
      mobileText: "Ajustes",
      icon: <Settings />,
      path: ROUTES.SETTINGS,
    },
  ];

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: isCollapsed ? 72 : 240,
            position: "fixed",
            height: "100%",
            top: 64,
            boxShadow: 3,
            borderRight: "none",
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.shorter,
              }),
            overflowX: "hidden",
            overflowY: "auto",
          },
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                minHeight: 48,
                justifyContent: "initial",
                px: 0,
                "&.Mui-selected": {
                  backgroundColor: "transparent",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 72,
                  display: "flex",
                  justifyContent: "center",
                  color:
                    location.pathname === item.path
                      ? "primary.main"
                      : "text.secondary",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  opacity: isCollapsed ? 0 : 1,
                  transition: (theme) =>
                    theme.transitions.create("opacity", {
                      easing: theme.transitions.easing.sharp,
                      duration: theme.transitions.duration.shorter,
                    }),
                  visibility: isCollapsed ? "hidden" : "visible",
                  "& .MuiTypography-root": {
                    color:
                      location.pathname === item.path
                        ? "primary.main"
                        : "text.primary",
                  },
                }}
              />
            </ListItemButton>
          ))}
          <Divider sx={{ my: 1 }} />
          <ListItemButton
            onClick={() => exportToCsv(members)}
            sx={{
              minHeight: 48,
              justifyContent: "initial",
              px: 0,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 72,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <DownloadIcon />
            </ListItemIcon>
            <ListItemText
              primary="Exportar miembros"
              sx={{
                opacity: isCollapsed ? 0 : 1,
                transition: (theme) =>
                  theme.transitions.create("opacity", {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.shorter,
                  }),
                visibility: isCollapsed ? "hidden" : "visible",
              }}
            />
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
          boxShadow: 3,
          pb: "calc(env(safe-area-inset-bottom) + 17px)", // Aumentado el padding inferior
        }}
        elevation={3}
      >
        <BottomNavigation
          sx={{
            height: 64,
            "& .MuiBottomNavigationAction-root": {
              padding: "8px 12px",
              minWidth: "auto",
              transition: "none",
              "& .MuiBottomNavigationAction-label": {
                fontSize: "0.75rem !important",
                transition: "none",
              },
              "& .MuiSvgIcon-root": {
                fontSize: "1.5rem !important",
                transition: "none",
                transform: "none !important",
              },
              "&.Mui-selected": {
                padding: "8px 12px",
                "& .MuiBottomNavigationAction-label": {
                  fontSize: "0.75rem !important",
                },
                "& .MuiSvgIcon-root": {
                  transform: "none !important",
                },
              },
            },
          }}
          value={location.pathname}
          onChange={(_, newPath) => {
            navigate(newPath);
          }}
          showLabels
        >
          {menuItems.map((item) => (
            <BottomNavigationAction
              key={item.text}
              label={item.mobileText}
              icon={item.icon}
              value={item.path}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </>
  );
};
