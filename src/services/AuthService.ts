// AuthService.ts
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  role: string;
  exp?: number;
  iat?: number;
  sub?: string;
}

class AuthService {
  async login(username: string, password: string) {
    try {
      const response = await axios.post('/authenticate', { username, password });
      console.log('Login response:', response.data);

      if (response.data.token) {
        const decodedToken = jwtDecode<JwtPayload>(response.data.token);
        console.log('Token decodificado:', decodedToken);

        const user = {
          ...response.data.user,
          token: response.data.token,
          roles: [{ id: 1, name: decodedToken.role }]
        };

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Token guardado en localStorage:', response.data.token);
        console.log('Usuario guardado en localStorage:', user);
        return { user };
      }
      throw new Error('No se recibió un token');
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  logout() {
    console.log('Cerrando sesión, eliminando token y usuario del localStorage');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    console.log('AuthService - Token:', token);
    console.log('AuthService - UserStr:', userStr);

    if (!userStr || !token) {
      console.log('AuthService - No hay usuario o token');
      return null;
    }

    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;
  
      console.log('AuthService - Token decodificado:', decodedToken);
  
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        console.log('AuthService - Token expirado');
        this.logout();
        return null;
      }
  
      const user = JSON.parse(userStr);
      // Modificamos esta parte para manejar el prefijo "ROLE_"
      const role = decodedToken.role.startsWith('ROLE_') 
        ? decodedToken.role.substring(5) 
        : decodedToken.role;
      user.roles = [{ id: 1, name: role }];
      console.log('AuthService - Usuario actual:', user);
      return {
        ...user,
        token
      };
    } catch (error) {
      console.error('AuthService - Error al procesar token:', error);
      this.logout();
      return null;
    }
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRoleFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode<JwtPayload>(token);
      console.log('AuthService - Rol extraído del token:', decodedToken.role);
      return [{ id: 1, name: decodedToken.role }];
    }
    console.log('AuthService - No se pudo extraer el rol del token');
    return [];
  }
}

export default new AuthService();