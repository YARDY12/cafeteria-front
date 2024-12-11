import React, { useState, useEffect } from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/login";
import Index from "./components/index";
import ProductoComponent from "./components/producto";
import EmpleadoComponent from "./components/empleado";
import PedidoComponent from "./components/pedido";
import DetallePedidoComponent from "./components/detalle_pedido";
import NoAutorizado from "./NoAutorizado";
import PrivateRoute from "./components/PrivateRoute";
import AuthService from "./services/AuthService";
import { User } from "./types/Auth";

const theme = extendTheme({
  colors: {
    teal: {
      500: "#319795",
    },
  },
});

const App: React.FC = () => {
  const [usuarioLogueado, setUsuarioLogueado] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = AuthService.getCurrentUser();
        console.log("App - Usuario actual:", user);

        if (user) {
          console.log("App - Roles del usuario:", user.roles);
        }

        setUsuarioLogueado(user);
      } catch (error) {
        console.error("App - Error verificando sesión:", error);
        setUsuarioLogueado(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogin = (usuario: User) => {
    console.log("Login exitoso:", usuario);
    setUsuarioLogueado(usuario);
  };

  const handleLogout = () => {
    console.log("Cerrando sesión");
    AuthService.logout();
    setUsuarioLogueado(null);
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f0f0f0",
        }}
      >
        <div>Cargando...</div>
      </div>
    );
  }

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              usuarioLogueado ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLoginSuccess={handleLogin} />
              )
            }
          />
          <Route
            path="/"
            element={
              usuarioLogueado ? (
                <Index onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/productos"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <ProductoComponent />
              </PrivateRoute>
            }
          />
          <Route
            path="/empleados"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <EmpleadoComponent />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/pedidos"
            element={
              usuarioLogueado ? (
                <PedidoComponent />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/detalles-pedido"
            element={
              usuarioLogueado ? (
                <DetallePedidoComponent />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/no-autorizado" element={<NoAutorizado />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
