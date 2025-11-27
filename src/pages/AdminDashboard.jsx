import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert as MuiAlert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { carService, bookingService } from '../services/api';

const initialCar = {
  brand: '',
  name: '',
  type: '',
  transmission: '',
  color: '',
  modelYear: '',
  price: '',
  description: '',
  imageUrl: '',
};

const AdminDashboard = () => {
  const [cars, setCars] = useState([]);
  const [newCar, setNewCar] = useState(initialCar);
  const [editCar, setEditCar] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCars();
    fetchBookings();
  }, []);

  const fetchCars = async () => {
    try {
      const data = await carService.getAllCars();
      setCars(data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error fetching cars', severity: 'error' });
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getAllBookings();
      setBookings(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      await carService.addCar(newCar);
      setSnackbar({ open: true, message: 'Car added!', severity: 'success' });
      setNewCar(initialCar);
      fetchCars();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error adding car', severity: 'error' });
    }
  };

  const handleDeleteCar = async (id) => {
    try {
      await carService.deleteCar(id);
      setSnackbar({ open: true, message: 'Car deleted!', severity: 'success' });
      fetchCars();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error deleting car', severity: 'error' });
    }
  };

  const handleEditCar = (car) => {
    setEditCar(car);
    setOpenEdit(true);
  };

  const handleUpdateCar = async () => {
    try {
      await carService.updateCar(editCar.id, editCar);
      setSnackbar({ open: true, message: 'Car updated!', severity: 'success' });
      setOpenEdit(false);
      setEditCar(null);
      fetchCars();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error updating car', severity: 'error' });
    }
  };

  const handleCancel = async (id) => {
    try {
      await bookingService.deleteBooking(id);
      setBookings(bookings.filter(b => b.id !== id));
    } catch (err) {
      alert('Failed to cancel booking');
    }
  };

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box sx={{ bgcolor: '#f5f6fa', minHeight: '100vh', width: '100vw', py: 8 }}>
      <Container maxWidth="lg">
        <Paper elevation={2} sx={{ p: 5, borderRadius: 3, mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            Add, edit, or delete cars below.
          </Typography>
          <Box component="form" onSubmit={handleAddCar} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              {Object.keys(initialCar).map((key) => (
                <Grid item xs={12} sm={6} md={3} key={key}>
                  <TextField
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    name={key}
                    value={newCar[key]}
                    onChange={(e) => setNewCar({ ...newCar, [key]: e.target.value })}
                    fullWidth
                    required={key !== 'imageUrl' && key !== 'description'}
                  />
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Add Car
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
        <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            All Cars
          </Typography>
          <Grid container spacing={2}>
            {cars.map((car) => (
              <Grid item xs={12} md={6} key={car.id}>
                <Paper elevation={0} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography fontWeight={600}>{car.brand} {car.name} ({car.modelYear})</Typography>
                    <Typography variant="body2" color="text.secondary">Type: {car.type} | Transmission: {car.transmission} | Color: {car.color}</Typography>
                    <Typography variant="body2" color="text.secondary">Price: ${car.price}/day</Typography>
                  </Box>
                  <Box>
                    <IconButton color="primary" onClick={() => handleEditCar(car)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleDeleteCar(car.id)}><DeleteIcon /></IconButton>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
          <DialogTitle>Edit Car</DialogTitle>
          <DialogContent>
            {editCar && Object.keys(initialCar).map((key) => (
              <TextField
                key={key}
                margin="dense"
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                name={key}
                value={editCar[key]}
                onChange={(e) => setEditCar({ ...editCar, [key]: e.target.value })}
                fullWidth
                required={key !== 'imageUrl' && key !== 'description'}
                sx={{ mb: 2 }}
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
            <Button onClick={handleUpdateCar} variant="contained">Update</Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <MuiAlert elevation={6} variant="filled" severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
        <AdminBookings />
      </Container>
    </Box>
  );
};

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await bookingService.getAllBookings();
        setBookings(data);
        setError('');
      } catch (err) {
        setError('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      await bookingService.deleteBooking(id);
      setBookings(bookings.filter(b => b.id !== id));
    } catch (err) {
      alert('Failed to cancel booking');
    }
  };

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>All Bookings</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>User</th><th>Car</th><th>Pickup</th><th>Return</th><th>Status</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.user?.username}</td>
              <td>{b.car?.brand} {b.car?.name}</td>
              <td>{b.pickupDate}</td>
              <td>{b.returnDate}</td>
              <td>{b.status}</td>
              <td><button onClick={() => handleCancel(b.id)}>Cancel</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;