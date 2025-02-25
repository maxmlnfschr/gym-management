import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Home, People, FitnessCenter, Settings, FileDownload } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/constants/routes';
import { exportToCsv } from '@/features/members/utils/exportToCsv';
import { useMemberStore } from '@/features/shared/stores/memberStore';

interface MainDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const MainDrawer = ({ open, onClose }: MainDrawerProps) => {
  const navigate = useNavigate();
  const { members } = useMemberStore();

  const menuItems = [
    { text: 'Dashboard', icon: <Home />, path: ROUTES.DASHBOARD },
    { text: 'Members', icon: <People />, path: ROUTES.MEMBERS },
    { text: 'Access', icon: <FitnessCenter />, path: ROUTES.ACCESS },
    { text: 'Settings', icon: <Settings />, path: ROUTES.SETTINGS },
  ];

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: 'block', sm: 'none' },
        '& .MuiDrawer-paper': { width: 240 },
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItemButton 
            key={item.text}
            onClick={() => {
              navigate(item.path);
              onClose();
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItemButton 
          onClick={() => {
            exportToCsv(members);
            onClose();
          }}
        >
          <ListItemIcon><FileDownload /></ListItemIcon>
          <ListItemText primary="Exportar miembros" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};