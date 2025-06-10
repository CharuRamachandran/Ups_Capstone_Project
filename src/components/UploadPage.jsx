import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Paper, 
  CircularProgress,
  IconButton,
  useTheme,
  Fade,
  Zoom,
  Alert,
  Snackbar
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { mockOcrApi } from '../utils/api';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const theme = useTheme();

  const validateFile = (file) => {
    if (!file) return 'Please select a file';
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'Only JPEG and PNG images are allowed';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }
    return null;
  };

  const handleFileChange = async (e) => {
    const f = e.target.files[0];
    if (f) {
      const validationError = validateFile(f);
      if (validationError) {
        setError(validationError);
        setFile(null);
        setPreviewUrl('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      try {
        // Verify that the file is actually an image
        const isValidImage = await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = URL.createObjectURL(f);
        });

        if (!isValidImage) {
          setError('The file appears to be corrupted or is not a valid image');
          setFile(null);
          setPreviewUrl('');
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          return;
        }

        setFile(f);
        setError('');
        setPreviewUrl(URL.createObjectURL(f));
      } catch (err) {
        setError('Failed to process the file');
        setFile(null);
        setPreviewUrl('');
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) {
      const validationError = validateFile(f);
      if (validationError) {
        setError(validationError);
        return;
      }

      try {
        // Verify that the file is actually an image
        const isValidImage = await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = URL.createObjectURL(f);
        });

        if (!isValidImage) {
          setError('The file appears to be corrupted or is not a valid image');
          return;
        }

        setFile(f);
        setError('');
        setPreviewUrl(URL.createObjectURL(f));
      } catch (err) {
        setError('Failed to process the file');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const metadata = await mockOcrApi(file);
      sessionStorage.setItem('ups_metadata', JSON.stringify(metadata));
      setSuccessMessage('File uploaded and processed successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError('Failed to process file');
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Container maxWidth="md">
      <Fade in timeout={800}>
        <Box>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Upload Label
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Upload a shipping label image for analysis
            </Typography>
          </Box>

          <Paper 
            elevation={0}
            sx={{ 
              border: '2px dashed',
              borderColor: isDragging ? 'primary.main' : file ? 'primary.main' : 'divider',
              borderRadius: 3,
              p: 4,
              bgcolor: file ? 'primary.main' : isDragging ? 'rgba(53, 28, 21, 0.02)' : 'background.paper',
              transition: 'all 0.3s ease-in-out',
              transform: isDragging ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            <Box
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: 300,
                justifyContent: 'center',
                color: file ? 'common.white' : 'text.primary',
              }}
            >
              {!file ? (
                <Fade in timeout={500}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CloudUploadIcon 
                      sx={{ 
                        fontSize: 64, 
                        mb: 2, 
                        color: isDragging ? 'primary.main' : 'primary.light',
                        transform: isDragging ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.3s ease-in-out',
                      }} 
                    />
                    <Typography variant="h6" gutterBottom align="center">
                      {isDragging ? 'Drop your file here' : 'Drag and drop your file here'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
                      or
                    </Typography>
                    <Button
                      variant="contained"
                      component="label"
                      sx={{ 
                        mt: 2,
                        background: 'linear-gradient(45deg, #351C15 30%, #4A2B21 90%)',
                      }}
                    >
                      Browse Files
                      <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        accept="image/jpeg,image/png"
                        onChange={handleFileChange}
                        disabled={loading}
                      />
                    </Button>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Supported formats: JPEG, PNG (Max size: 5MB)
                    </Typography>
                  </Box>
                </Fade>
              ) : (
                <Zoom in timeout={500}>
                  <Box sx={{ width: '100%', textAlign: 'center' }}>
                    {previewUrl ? (
                      <Box sx={{ position: 'relative', display: 'inline-block' }}>
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: 300,
                            borderRadius: theme.shape.borderRadius,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                          }} 
                        />
                        <Box 
                          sx={{ 
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            bgcolor: 'rgba(255,255,255,0.9)',
                            borderRadius: '50%',
                            p: 0.5,
                          }}
                        >
                          <CheckCircleIcon sx={{ color: 'success.main' }} />
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {file.name}
                      </Typography>
                    )}
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleUpload}
                        disabled={loading}
                        sx={{ 
                          bgcolor: 'secondary.main',
                          color: '#FFFFFF',
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          '&:hover': {
                            bgcolor: 'secondary.dark',
                          },
                          minWidth: 180,
                          boxShadow: '0 4px 12px rgba(255, 181, 0, 0.3)',
                          border: '2px solid',
                          borderColor: 'secondary.dark',
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={24} sx={{ color: '#FFFFFF' }} />
                        ) : (
                          'Process Label'
                        )}
                      </Button>
                      <IconButton 
                        onClick={clearFile}
                        disabled={loading}
                        sx={{ 
                          color: 'common.white',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Zoom>
              )}
            </Box>
          </Paper>
          
          {error && (
            <Fade in timeout={500}>
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 2,
                  borderRadius: 2,
                }}
              >
                {error}
              </Alert>
            </Fade>
          )}

          <Snackbar
            open={!!successMessage}
            autoHideDuration={2000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert 
              severity="success"
              sx={{ 
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              {successMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Fade>
    </Container>
  );
};

export default UploadPage; 