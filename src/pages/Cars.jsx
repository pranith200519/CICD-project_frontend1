import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { carService } from '../services/api';

const Cars = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    brand: '',
    type: '',
    transmission: '',
  });

  const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x200?text=No+Image';

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const data = await carService.getAllCars();
      setCars(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch cars. Please try again later.');
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (event) => {
    const newFilters = {
      ...filters,
      [event.target.name]: event.target.value,
    };
    setFilters(newFilters);

    try {
      setLoading(true);
      const data = await carService.searchCars(newFilters);
      setCars(data);
      setError('');
    } catch (err) {
      setError('Failed to filter cars. Please try again.');
      console.error('Error filtering cars:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && cars.length === 0) {
    return (
      <Box sx={{ bgcolor: '#f5f6fa', minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f5f6fa', minHeight: '100vh', width: '100vw', py: 8 }}>
      <Container maxWidth="lg">
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Filters */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Brand"
                name="brand"
                value={filters.brand}
                onChange={handleFilterChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={filters.type}
                  label="Type"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Sedan">Sedan</MenuItem>
                  <MenuItem value="SUV">SUV</MenuItem>
                  <MenuItem value="Sports">Sports</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Transmission</InputLabel>
                <Select
                  name="transmission"
                  value={filters.transmission}
                  label="Transmission"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Automatic">Automatic</MenuItem>
                  <MenuItem value="Manual">Manual</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Car Grid */}
        <Grid container spacing={4}>
          {cars.map((car) => (
            <Grid item key={car.id} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={car.imageUrl || PLACEHOLDER_IMAGE}
                  alt={car.name}
                  onError={e => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE; }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {car.brand} {car.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type: {car.type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Transmission: {car.transmission}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                    ${car.price}/day
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => navigate(`/cars/${car.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Cars; 