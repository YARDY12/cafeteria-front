import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../services/AuthService';

interface NavigationProps {
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    AuthService.logout();
    onLogout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#6d4c41', width: '100%' }}>
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          Cafetería Agosto 18
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className={`nav-link ${isActive('/productos') ? 'active' : ''}`} href="/productos">
                <i className="bi bi-box-fill me-2"></i>Productos
              </a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${isActive('/empleados') ? 'active' : ''}`} href="/empleados">
                <i className="bi bi-person-plus-fill me-2"></i>Empleados
              </a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${isActive('/pedidos') ? 'active' : ''}`} href="/pedidos">
                <i className="bi bi-pencil-square me-2"></i>Pedidos
              </a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${isActive('/detalles-pedido') ? 'active' : ''}`} href="/detalles-pedido">
                <i className="bi bi-file-text me-2"></i>Detalles de Pedido
              </a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${isActive('/usuarios') ? 'active' : ''}`} href="/usuarios">
                <i className="bi bi-people-fill me-2"></i>Usuarios
              </a>
            </li>
          </ul>
          <button
            onClick={handleLogout}
            className="btn btn-outline-light"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

