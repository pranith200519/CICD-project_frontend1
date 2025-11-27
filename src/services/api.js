import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.id,
        username: response.data.username,
        roles: response.data.roles,
        token: response.data.accessToken
      }));
    }
    return response.data;
  },

  register: async (username, email, password, role) => {
    const response = await api.post('/auth/signup', {
      username,
      email,
      password,
      role,
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// Car services
export const carService = {
  getAllCars: async () => {
    const response = await api.get('/cars');
    return response.data;
  },

  getCarById: async (id) => {
    const response = await api.get(`/cars/${id}`);
    return response.data;
  },

  searchCars: async (filters) => {
    const response = await api.get('/cars/search', { params: filters });
    return response.data;
  },

  addCar: async (car) => {
    const response = await api.post('/cars', car);
    return response.data;
  },

  updateCar: async (id, car) => {
    const response = await api.put(`/cars/${id}`, car);
    return response.data;
  },

  deleteCar: async (id) => {
    const response = await api.delete(`/cars/${id}`);
    return response.data;
  },
};

// Booking services
export const bookingService = {
  createBooking: async (booking) => {
    const response = await api.post('/bookings', booking);
    return response.data;
  },
  getAllBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },
  getBookingsByUser: async (userId) => {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
  },
  deleteBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
};

export default api; 