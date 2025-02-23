import { Box, AppBar, Toolbar, Container, IconButton, Typography } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Outlet } from 'react-router-dom';
import { useUIStore } from '@/features/shared/stores/uiStore';
import { MainDrawer } from '@/layouts/MainLayout/MainDrawer';

export const MainLayout = () => {
  const { isDrawerOpen, toggleDrawer } = useUIStore();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
            Gym Management
          </Typography>
        </Toolbar>
      </AppBar>
      <MainDrawer open={isDrawerOpen} onClose={toggleDrawer} />
      <Container component="main" sx={{ flex: 1, py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
};