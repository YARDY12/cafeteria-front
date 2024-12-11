export interface User {
  id?: number;
  username: string;
  password?: string;
  token?: string;
  nombre: string;
  apellido: string;
  email: string;
  roles?: { id: number; name: string }[];
}

export interface Role {
  id: number;
  name: string;
}