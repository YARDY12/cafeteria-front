import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { User, Role } from '../types/Auth'; // Asegúrate de que la ruta de importación sea correcta

interface PrivateRouteProps {
  requiredRole: string;
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ requiredRole, children }) => {
  const currentUser = AuthService.getCurrentUser() as User | null;

  console.log('PrivateRoute - Usuario actual:', currentUser);
  console.log('PrivateRoute - Rol requerido:', requiredRole);

  if (!currentUser) {
    console.log('PrivateRoute - Usuario no autenticado');
    return <Navigate to="/login" replace />;
  }

  const userRoles = currentUser.roles?.map((role: Role) => role.name) || [];
  console.log('PrivateRoute - Roles del usuario:', userRoles);

  // Modificamos esta parte para manejar tanto "ADMIN" como "ROLE_ADMIN"
  const hasRequiredRole = userRoles.some((roleName: string) => 
    roleName === requiredRole || roleName === `ROLE_${requiredRole}`
  );

  if (!hasRequiredRole) {
    console.log('PrivateRoute - Acceso denegado: Rol insuficiente');
    return <Navigate to="/no-autorizado" replace />;
  }

  console.log('PrivateRoute - Acceso permitido');
  return <>{children}</>;
};

export default PrivateRoute;