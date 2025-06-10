import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';
import { Container, Box, TextField, Button, Typography, Paper, InputAdornment, Fade } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/upload');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <Container maxWidth="sm">
      <Fade in timeout={800}>
        <Box
          sx={{
            mt: { xs: 4, sm: 8 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              mb: 4,
              p: 2,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(53, 28, 21, 0.2)',
            }}
          >
            <LocalShippingOutlinedIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
          </Box>

          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              width: '100%',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #FFB500, #FFC640)',
              },
            }}
          >
            <Box 
              sx={{ 
                mb: 4, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center' 
              }}
            >
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 'bold',
                  mb: 1,
                  textAlign: 'center',
                }}
              >
                Welcome Back
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                align="center"
                sx={{ maxWidth: 300 }}
              >
                Sign in to access UPS Label Analyzer
              </Typography>
            </Box>

            <Box 
              component="form" 
              onSubmit={handleSubmit} 
              noValidate
              sx={{
                '& .MuiTextField-root': {
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                },
              }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={e => setUsername(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              {error && (
                <Fade in>
                  <Typography 
                    color="error" 
                    variant="body2" 
                    sx={{ 
                      mt: 2, 
                      textAlign: 'center',
                      p: 1,
                      borderRadius: 1,
                      bgcolor: 'error.light',
                      color: 'error.dark',
                    }}
                  >
                    {error}
                  </Typography>
                </Fade>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  height: 48,
                }}
              >
                Sign In
              </Button>
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
};

export default LoginPage; 