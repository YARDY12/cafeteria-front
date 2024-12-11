import React from "react";
import { useNavigate } from "react-router-dom";
import Error403 from "./error/Error403";
import "./error/Error403.css";

const NoAutorizado: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="error-403-container">
      <Error403 />
      <p>No estás autorizado de estar aquí</p>
      <button onClick={handleGoHome} className="go-home-button">
        Regresar al inicio
      </button>
    </div>
  );
};

export default NoAutorizado;
