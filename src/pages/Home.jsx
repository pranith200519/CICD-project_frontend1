import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../services/api';
import { getCurrentUser } from '../services/auth';
import { useEffect, useState } from 'react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: '#f5f6fa', minHeight: '100vh', width: '100vw', py: 8 }}>
      <Container maxWidth="md">
        <Paper elevation={2} sx={{ p: 5, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
            Welcome to Car Rental
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom color="text.secondary">
            Find your perfect ride for any occasion
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/cars')}
            sx={{ mt: 4, px: 5 }}
          >
            Browse Cars
          </Button>
        </Paper>
        <Grid container spacing={4} sx={{ mt: 6 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'transparent' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Wide Selection
              </Typography>
              <Typography color="text.secondary">
                Choose from our extensive collection of vehicles
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'transparent' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Best Prices
              </Typography>
              <Typography color="text.secondary">
                Competitive rates and transparent pricing
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'transparent' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                24/7 Support
              </Typography>
              <Typography color="text.secondary">
                Round-the-clock customer service
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await bookingService.getBookingsByUser(user.id);
        setBookings(data);
        setError('');
      } catch (err) {
        setError('Failed to fetch your bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  if (!user) return <div>Please log in to view your bookings.</div>;
  if (loading) return <div>Loading your bookings...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>My Bookings</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Car</th><th>Pickup</th><th>Return</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.car?.brand} {b.car?.name}</td>
              <td>{b.pickupDate}</td>
              <td>{b.returnDate}</td>
              <td>{b.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Home; 