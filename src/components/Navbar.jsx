import { AppBar, Toolbar, Typography, Button, Box, Container, Divider } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { getCurrentUser, isAdmin } from '../services/auth';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    const handleStorage = () => setUser(getCurrentUser());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static" color="primary" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 64 }}>
            <DirectionsCarIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                flexGrow: 1,
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              Car Rental
            </Typography>
            <Box>
              <Button color="inherit" component={RouterLink} to="/" sx={{ mx: 1 }}>
                Home
              </Button>
              <Button color="inherit" component={RouterLink} to="/cars" sx={{ mx: 1 }}>
                Cars
              </Button>
              {isAdmin() && (
                <Button color="inherit" component={RouterLink} to="/admin" sx={{ mx: 1 }}>
                  Admin Dashboard
                </Button>
              )}
              {user ? (
                <>
                  <Button color="inherit" component={RouterLink} to="/my-bookings" sx={{ mx: 1 }}>
                    My Bookings
                  </Button>
                  <Button color="inherit" onClick={handleLogout} sx={{ mx: 1 }}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button color="inherit" component={RouterLink} to="/login" sx={{ mx: 1 }}>
                    Login
                  </Button>
                  <Button color="inherit" component={RouterLink} to="/register" sx={{ mx: 1 }}>
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Divider />
    </>
  );
};

export default Navbar; 