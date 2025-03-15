import { Box, Container, Tab, Tabs } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export const SettingsLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { label: 'General', path: '/settings/general' },
    { label: 'Planes de Membresía', path: '/settings/membership-plans' },
  ];

  const currentTab = tabs.findIndex(tab => location.pathname === tab.path);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={currentTab !== -1 ? currentTab : 0}
          onChange={(_, newValue) => navigate(tabs[newValue].path)}
        >
          {tabs.map((tab) => (
            <Tab key={tab.path} label={tab.label} />
          ))}
        </Tabs>
      </Box>
      <Box sx={{ py: 2 }}>
        <Outlet />
      </Box>
    </Container>
  );
};