import axios from 'axios';

const API_URL = 'http://localhost:3120/api/auth/';

const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData, {
    withCredentials: true,
  });

  if (response.data) {
    // Storing user data in localStorage
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData, {
    withCredentials: true,
  });

  if (response.data) {
    // Storing user data in localStorage
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

const logout = async () => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
