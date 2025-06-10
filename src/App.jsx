import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import LoginPage from './components/LoginPage';
import UploadPage from './components/UploadPage';
import DashboardPage from './components/DashboardPage';
import AnalyticsPage from './components/AnalyticsPage';
import ProtectedRoute from './components/ProtectedRoute';
import { CssBaseline, AppBar, Toolbar, Typography, Button, Box, Container, Stack } from '@mui/material';
import { useAuth } from './utils/auth';
import theme from './theme';
import { useLocation, useNavigate } from 'react-router-dom';

function App() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Upload', path: '/upload' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Analytics', path: '/analytics' },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.main' }}>
          <Container maxWidth="lg">
            <Toolbar sx={{ px: { xs: 0 } }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  flexGrow: 1, 
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
                onClick={() => navigate('/upload')}
              >
                Package Label
              </Typography>
              {isAuthenticated && (
                <Stack direction="row" spacing={2} sx={{ mr: 2 }}>
                  {navItems.map((item) => (
                    <Button
                      key={item.path}
                      color="inherit"
                      onClick={() => navigate(item.path)}
                      sx={{
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: '2px',
                          bgcolor: 'secondary.main',
                          opacity: location.pathname === item.path ? 1 : 0,
                        }
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Stack>
              )}
              {isAuthenticated && (
                <Button 
                  color="inherit" 
                  onClick={logout}
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                    }
                  }}
                >
                  Logout
                </Button>
              )}
            </Toolbar>
          </Container>
        </AppBar>
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            bgcolor: 'background.default',
            py: 4
          }}
        >
          <Container maxWidth="lg">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/upload" element={
                <ProtectedRoute>
                  <UploadPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App; 