import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  ListItemButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../utils/auth';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const DRAWER_WIDTH = 240;

const Layout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const menuItems = [
    { text: 'Upload', icon: <UploadFileIcon />, path: '/upload' },
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileClose();
    logout();
  };

  const drawer = (
    <Box sx={{ mt: 2 }}>
      <List>
        {[
          { text: 'Upload', path: '/upload', icon: <CloudUploadIcon /> },
          { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
          { text: 'Analytics', path: '/analytics', icon: <AnalyticsIcon /> },
        ].map((item) => (
          <ListItem 
            key={item.text} 
            disablePadding
            sx={{
              borderBottom: location.pathname === item.path ? '2px solid #FFB500' : 'none',
            }}
          >
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                handleDrawerToggle();
              }}
              sx={{
                color: '#351C15',
                '&:hover': {
                  backgroundColor: 'rgba(53, 28, 21, 0.04)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(53, 28, 21, 0.08)',
                },
                minHeight: 48,
              }}
              selected={location.pathname === item.path}
            >
              <ListItemIcon
                sx={{
                  color: '#351C15',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{
                  '& .MuiTypography-root': {
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                    color: '#351C15',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 2 }} />
        <ListItem 
          disablePadding
          sx={{ mb: 1 }}
        >
          <ListItemButton
            onClick={logout}
            sx={{
              borderRadius: '0 24px 24px 0',
              mr: 2,
              '&:hover': {
                backgroundColor: 'rgba(53, 28, 21, 0.12)',
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: 'text.secondary',
              minWidth: 40,
            }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: '100%',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2,
              color: '#ffffff'
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              color: '#ffffff',
              fontWeight: 'bold',
            }}
          >
            Package Label
          </Typography>
          <IconButton
            onClick={handleProfileClick}
            sx={{
              padding: 0.5,
              border: '2px solid',
              borderColor: 'primary.main',
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                width: 32,
                height: 32,
              }}
            >
              U
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileClose}
            PaperProps={{
              sx: {
                mt: 1,
                boxShadow: theme.shadows[3],
              }
            }}
          >
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              borderRight: 'none',
              boxShadow: theme.shadows[3],
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          mt: '64px',
          backgroundColor: 'background.default',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout; 