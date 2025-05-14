import {
  CalendarMonth as CalendarIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Person,
  Pets as PetsIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { Alert, AppBar, Avatar, Box, CircularProgress, Container, Drawer, IconButton, InputAdornment, List, ListItemButton, ListItemIcon, ListItemText, TextField, Toolbar, Typography, useTheme } from "@mui/material";
import React, { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import logo from '../../../assets/logo.png';
import { useAuth } from "../../../hooks/useAuth";
import { Path } from "../../../interfaces/Path";
import { RoleEnum } from "../../../interfaces/role";
import { User } from "../../../types/auth.types";

interface ConnectedLayoutProps {
  children: React.ReactNode
}

const ConnectedLayout = ({ children }: ConnectedLayoutProps) => {


  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout } = useAuth() as { user: User | null; loading: boolean; logout: () => Promise<void> };
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate(Path.LOGIN);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const drawerWidth = 240;

  const sidebarItems: {
    text: string
    icon: ReactNode
    path: string
  }[] = user ? [
    { text: 'Dashboard', icon: <DashboardIcon />, path: Path.DASHBOARD },
    { text: 'Mes animaux', icon: <PetsIcon />, path: `${Path.DASHBOARD}${Path.ANIMALS}` },
    { text: "Demandes d'accueil", icon: <CalendarIcon />, path: `${Path.DASHBOARD}${Path.REQUESTS}` },
    {
      text: 'Mon profil', icon: <Person />, path: user.role.name === RoleEnum.FOSTER
        ? `${Path.DASHBOARD}${Path.FOSTER_PROFILE}`
        : `${Path.DASHBOARD}${Path.SHELTER_PROFILE}`
    }
  ] : [
      { text: 'Dashboard', icon: <DashboardIcon />, path: Path.DASHBOARD },
    ];

  // Gestion du drawer responsive
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Correction du rendu des items de la sidebar
  const renderSidebarContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Link to={Path.HOME}><img src={logo} alt="Logo" style={{ height: 150 }} /></Link>
        <Link to={Path.HOME}><Typography variant="h6" sx={{ fontWeight: 600 }}>PetFoster</Typography></Link>
      </Box>

      <Box sx={{ m: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar>{user?.email[0].toUpperCase()}</Avatar>
          <Box>
            <Typography variant="subtitle2">{user?.email}</Typography>
            <Typography variant="caption" color="textSecondary">
              {user?.role.name}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ flex: 1, p: 2 }}>
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {sidebarItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                },
                '&.Mui-selected': {
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)'
                  }
                }
              }}
              selected={location.pathname === item.path || (item.path !== Path.DASHBOARD && location.pathname.startsWith(item.path))}
            >
              <ListItemIcon sx={{ color: theme.palette.primary.main, minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: 500
                  }
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <ListItemIcon sx={{ color: theme.palette.primary.main, minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Déconnexion" />
        </ListItemButton>
      </Box>
    </Box>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container>
        <Alert severity="error">
          Vous devez être connecté pour accéder à cette page.
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{
      display: 'flex',
      height: '100dvh',
      overflowX: 'auto',
      overflowY: 'hidden',
    }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            height: '100%',
            bgcolor: 'white',
            color: theme.palette.primary.main
          },
        }}
      >
        {renderSidebarContent()}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'white',
            color: theme.palette.primary.main,
            borderRight: 'none',
            boxShadow: theme.shadows[3],
            height: '100dvh',
          },
        }}
        open
      >
        {renderSidebarContent()}
      </Drawer>

      {/* Main content wrapper with proper spacing */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { sm: `${drawerWidth}px` },
          minHeight: '100vh',
          bgcolor: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Top bar */}
        <AppBar
          position="static"
          color="transparent"
          elevation={0}
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            bgcolor: 'white',
            display: { xs: 'block', sm: 'none' },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

          </Toolbar>
        </AppBar>

        {/* Content */}
        {children}
      </Box>
    </Box>
  );
}

export default ConnectedLayout;