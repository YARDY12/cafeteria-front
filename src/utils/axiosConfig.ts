// axiosConfig.ts
import axios from 'axios';
import AuthService from '../services/AuthService';

const instance = axios.create({
  baseURL: 'http://localhost:8080/api',
});

instance.interceptors.request.use(
  (config) => {
    const user = AuthService.getCurrentUser();
    if (user && user.token) {
      config.headers['Authorization'] = 'Bearer ' + user.token;
      console.log('Interceptor de solicitud - Token añadido:', user.token);
    }
    return config;
  },
  (error) => {
    console.error('Error en el interceptor de solicitud:', error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Axios interceptor error:', error.response);
    
    if (error.response?.status === 403 || error.response?.status === 401) {
      console.log('Error de autorización/autenticación');
      console.log('Detalles del error:', error.response.data);
      AuthService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;