import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import LoginPage from './components/LoginPage';
import UploadPage from './components/UploadPage';
import DashboardPage from './components/DashboardPage';
import AnalyticsPage from './components/AnalyticsPage';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { CssBaseline } from '@mui/material';
import { useAuth } from './utils/auth';
import theme from './theme';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/" element={<Navigate to="/upload" replace />} />
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated ? "/upload" : "/login"} replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App; 