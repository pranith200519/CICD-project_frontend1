import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { bookingService } from '../services/api';
import { getCurrentUser } from '../services/auth';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user] = useState(getCurrentUser());

  const fetchBookings = useCallback(async () => {
    if (!user) return;
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
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (!user) {
    return (
      <Box sx={{ bgcolor: '#f5f6fa', minHeight: '100vh', width: '100vw', py: 8 }}>
        <Container maxWidth="lg">
          <Alert severity="info">Please log in to view your bookings.</Alert>
        </Container>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ bgcolor: '#f5f6fa', minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ bgcolor: '#f5f6fa', minHeight: '100vh', width: '100vw', py: 8 }}>
        <Container maxWidth="lg">
          <Alert severity="error">{error}</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f5f6fa', minHeight: '100vh', width: '100vw', py: 8 }}>
      <Container maxWidth="lg">
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom fontWeight={700}>
            My Bookings
          </Typography>
          {bookings.length === 0 ? (
            <Alert severity="info">You haven't made any bookings yet.</Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Car</TableCell>
                    <TableCell>Pickup Date</TableCell>
                    <TableCell>Return Date</TableCell>
                    <TableCell>Total Price</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {booking.car?.brand} {booking.car?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {booking.car?.type} • {booking.car?.transmission}
                        </Typography>
                      </TableCell>
                      <TableCell>{new Date(booking.pickupDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(booking.returnDate).toLocaleDateString()}</TableCell>
                      <TableCell>${booking.totalPrice}</TableCell>
                      <TableCell>
                        <Chip
                          label={booking.status}
                          color={getStatusColor(booking.status)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default MyBookings; 