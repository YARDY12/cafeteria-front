// index.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "animate.css";
import UserManagement from "./UserManagment";
import AuthService from "../services/AuthService";

interface IndexProps {
  onLogout: () => void;
}

const Index: React.FC<IndexProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [showUsuarios, setShowUsuarios] = React.useState(false);

  const onShowUsuarios = () => {
    setShowUsuarios(!showUsuarios);
  };

  const handleLogout = () => {
    AuthService.logout();
    onLogout();
    navigate('/login');
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (


    <div
      className="main-container"
      style={{
        backgroundColor: "#f5e8c7",
        height: "100vh",
        width: "100vw",
        margin: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#333",
        position: "relative",
      }}
    >
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          backgroundColor: "#6d4c41",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Cerrar sesión
      </button>
      <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{ backgroundColor: "#6d4c41" }}
      >
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Cafetería Agosto 18
          </a>
        </div>
      </nav>
      
      <div
        className="card animate__animated animate__fadeInUp"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "15px",
          boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)",
          padding: "2rem",
          width: "500px",
        }}
      >
        <img
          src="https://scontent.flim1-2.fna.fbcdn.net/v/t39.30808-6/297028427_104101122405950_7133737936724523807_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=u9vr9nbXS6oQ7kNvgGfhKk6&_nc_zt=23&_nc_ht=scontent.flim1-2.fna&_nc_gid=ATt9eJLD1DnkpazdK_kZjOo&oh=00_AYAWyfSO071q1jA_OHVDIs5Pj2n0RCpCEAoDbnJLQ0wiow&oe=6753E0B4"
          alt="Logo Cafetería"
          className="logo mb-4"
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            objectFit: "cover",
            margin: "0 auto",
            display: "block",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
          }}
        />

        <div className="list-group">
          <a
            href="#"
            className="list-group-item list-group-item-action"
            onClick={() => navigateTo('/productos')}
          >
            <i className="bi bi-box-fill"></i> Gestión de Productos
          </a>
          <a
            href="#"
            className="list-group-item list-group-item-action"
            onClick={() => navigateTo('/empleados')}
          >
            <i className="bi bi-person-plus-fill"></i> Gestión de Empleados
          </a>

          <a
            href="#"
            className="list-group-item list-group-item-action"
            onClick={() => navigateTo('/pedidos')}
          >
            <i className="bi bi-pencil-square"></i> Gestión de Pedidos
          </a>
          <a
            href="#"
            className="list-group-item list-group-item-action"
            onClick={() => navigateTo('/detalles-pedido')}
          >
            <i className="bi bi-file-text"></i> Gestión de Detalles de Pedido
          </a>
          <a
            href="#"
            className="list-group-item list-group-item-action"
            onClick={onShowUsuarios}
          >
            <i className="bi bi-people-fill"></i> Gestión de Usuarios
          </a>
        </div>

        {showUsuarios && <UserManagement />}
      </div>
    </div>
  );
};

export default Index;