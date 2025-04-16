import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Vote from './pages/Vote';
import Results from './pages/Results';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Create a light theme with custom colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#4A90E2', // Soft blue
      light: '#7EB6FF',
      dark: '#2A5BA3',
    },
    secondary: {
      main: '#F5A623', // Soft orange
      light: '#FFD280',
      dark: '#C17A1B',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      color: '#2C3E50',
    },
    h2: {
      fontWeight: 500,
      color: '#34495E',
    },
    body1: {
      color: '#5D6D7E',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: 4 }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/vote" element={<Vote />} />
                  <Route path="/results" element={<Results />} />
                </Route>
              </Routes>
            </Container>
          </Box>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App; 