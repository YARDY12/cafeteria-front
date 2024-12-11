import axiosInstance from '../utils/axiosConfig';
import { User, Role } from '../types/Auth';

const API_URL = '/usuarios';

class UserService {
  getUsers() {
    return axiosInstance.get<User[]>(API_URL);
  }

  getUserById(id: number) {
    return axiosInstance.get<User>(`${API_URL}/${id}`);
  }

  createUser(user: Omit<User, 'id'> & { roleId: number }) {
    const userData = {
      username: user.username,
      password: user.password,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      roles: [{ id: user.roleId }]
    };
    return axiosInstance.post<User>(API_URL, userData);
  }

  updateUser(id: number, user: Partial<User> & { roleId?: string }) {
    const userData: {
      username?: string;
      nombre?: string;
      apellido?: string;
      email?: string;
      roles: { id: number }[];
      password?: string;
    } = {
      username: user.username,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      roles: [{ id: parseInt(user.roleId || '1') }]
    };
    
    if (user.password) {
      userData.password = user.password;
    }
    
    return axiosInstance.put<User>(`${API_URL}/${id}`, userData);
  }

  deleteUser(id: number) {
    return axiosInstance.delete<void>(`${API_URL}/${id}`);
  }

  getRoles() {
    return axiosInstance.get<Role[]>('/roles');
  }
}

export default new UserService();

