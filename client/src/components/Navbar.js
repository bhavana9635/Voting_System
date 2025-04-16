import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <HowToVoteIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'text.primary',
              fontWeight: 600,
            }}
          >
            Blockchain Voting
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {isAuthenticated ? (
              <>
                <Button
                  component={RouterLink}
                  to="/"
                  color="inherit"
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  Home
                </Button>
                <Button
                  component={RouterLink}
                  to="/vote"
                  color="inherit"
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  Vote
                </Button>
                <Button
                  component={RouterLink}
                  to="/results"
                  color="inherit"
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  Results
                </Button>
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                color="primary"
                variant="contained"
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 