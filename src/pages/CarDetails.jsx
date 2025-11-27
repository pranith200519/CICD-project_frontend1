import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpeedIcon from '@mui/icons-material/Speed';
import SettingsIcon from '@mui/icons-material/Settings';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { carService, bookingService } from '../services/api';
import { getCurrentUser } from '../services/auth';

// Use a realistic car image as placeholder
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=800&q=80';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openBook, setOpenBook] = useState(false);
  const [booking, setBooking] = useState({ date: '', returnDate: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showSummary, setShowSummary] = useState(false);
  const [bookingSummary, setBookingSummary] = useState(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        const data = await carService.getCarById(id);
        setCar(data);
        setError('');
      } catch (err) {
        setError('Failed to fetch car details. Please try again later.');
        console.error('Error fetching car details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  const handleBookNow = () => {
    setOpenBook(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const user = getCurrentUser();
    console.log('Current user:', user);
    if (!user) {
      setSnackbar({ open: true, message: 'Please log in to book a car!', severity: 'error' });
      return;
    }
    if (!car || !booking.date || !booking.returnDate) {
      setSnackbar({ open: true, message: 'All fields are required!', severity: 'error' });
      return;
    }
    const pickupDate = booking.date + 'T00:00:00';
    const returnDate = booking.returnDate + 'T00:00:00';
    // Calculate number of days
    const days = Math.ceil(
      (new Date(booking.returnDate) - new Date(booking.date)) / (1000 * 60 * 60 * 24)
    );
    if (days < 1) {
      setSnackbar({ open: true, message: 'Return date must be after pickup date!', severity: 'error' });
      return;
    }
    const summary = {
      car: { id: car.id },
      user: { id: user.id },
      pickupDate,
      returnDate,
      totalPrice: car.price * days,
      status: 'pending',
    };
    setBookingSummary(summary);
    setShowSummary(true);
  };

  const handleConfirmBooking = async () => {
    try {
      await bookingService.createBooking(bookingSummary);
      setOpenBook(false);
      setShowSummary(false);
      setSnackbar({ open: true, message: 'Car booked successfully!', severity: 'success' });
      setBooking({ date: '', returnDate: '' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Booking failed!', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: '#f5f6fa', minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ bgcolor: '#f5f6fa', minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!car) {
    return (
      <Box sx={{ bgcolor: '#f5f6fa', minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Alert severity="info">Car not found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f5f6fa', minHeight: '100vh', width: '100vw', py: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Car Image */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3}>
              <img
                src={car.imageUrl || PLACEHOLDER_IMAGE}
                alt={`${car.brand} ${car.name}`}
                style={{ width: '100%', height: 'auto', objectFit: 'cover', maxHeight: 400 }}
                onError={e => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE; }}
              />
              {/* If you want to always show a sample car image for demo, uncomment below: */}
              {/* <img src="https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=800&q=80" alt="Sample Car" style={{ width: '100%', height: 'auto', objectFit: 'cover', maxHeight: 400, marginTop: 16 }} /> */}
            </Paper>
          </Grid>

          {/* Car Details */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom>
                {car.brand} {car.name}
              </Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                ${car.price}/day
              </Typography>

              <Box sx={{ my: 2 }}>
                <Chip
                  icon={<DirectionsCarIcon />}
                  label={car.type}
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip
                  icon={<SettingsIcon />}
                  label={car.transmission}
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip
                  icon={<ColorLensIcon />}
                  label={car.color}
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip
                  icon={<SpeedIcon />}
                  label={`${car.modelYear}`}
                  sx={{ mr: 1, mb: 1 }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body1" paragraph>
                {car.description}
              </Typography>

              {getCurrentUser() && (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleBookNow}
                >
                  Book Now
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>
        <Dialog open={openBook} onClose={() => setOpenBook(false)}>
          <DialogTitle>Book Car</DialogTitle>
          <Box component="form" onSubmit={handleBookingSubmit}>
            <DialogContent>
              <TextField
                label="Booking Date"
                type="date"
                name="date"
                value={booking.date}
                onChange={e => setBooking({ ...booking, date: e.target.value })}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Return Date"
                type="date"
                name="returnDate"
                value={booking.returnDate}
                onChange={e => setBooking({ ...booking, returnDate: e.target.value })}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenBook(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Book</Button>
            </DialogActions>
          </Box>
        </Dialog>
        <Dialog open={showSummary} onClose={() => setShowSummary(false)}>
          <DialogTitle>Confirm Booking</DialogTitle>
          <DialogContent>
            <Typography>Car: {car.brand} {car.name}</Typography>
            <Typography>Pickup Date: {bookingSummary?.pickupDate}</Typography>
            <Typography>Return Date: {bookingSummary?.returnDate}</Typography>
            <Typography>Total Price: ${bookingSummary?.totalPrice}</Typography>
            <Typography>Status: {bookingSummary?.status}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowSummary(false)}>Back</Button>
            <Button onClick={handleConfirmBooking} variant="contained">Confirm</Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default CarDetails; 