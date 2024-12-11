import React, { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import axiosInstance from "../utils/axiosConfig";
import AuthService from "../services/AuthService";
import { Empleado } from "../types/empleado";
import { useNavigate } from "react-router-dom";

const EmpleadoComponent: React.FC = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [empleadoId, setEmpleadoId] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [genero, setGenero] = useState("Masculino");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [puesto, setPuesto] = useState("Mesero");
  const [salario, setSalario] = useState<number | undefined>();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      const user = AuthService.getCurrentUser();
      console.log('EmpleadoComponent - Usuario actual:', user);
      
      if (!user || !user.token) {
        console.log('EmpleadoComponent - No hay sesión activa');
        toast({
          title: "Error de autenticación",
          description: "Por favor, inicie sesión nuevamente",
          status: "error",
          duration: 3000,
          isClosable: true
        });
        navigate("/login");
        return;
      }

      try {
        await cargarEmpleados();
      } catch (error) {
        console.error('Error al cargar empleados:', error);
      }
    };

    checkAuthAndLoadData();
  }, [navigate]);

  const cargarEmpleados = async () => {
    try {
      console.log('Intentando cargar empleados...');
      const response = await axiosInstance.get("/empleados");
      console.log('Respuesta:', response);
      setEmpleados(response.data);
    } catch (error: any) {
      console.error("Error completo:", error);
      console.error("Estado de la respuesta:", error.response?.status);
      toast({
        title: "Error",
        description:
          error.response?.status === 403
            ? "No tienes permiso para acceder a los empleados"
            : "Error al cargar los empleados",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const empleado: Empleado = {
      id_empleado: empleadoId || 0,
      nombre,
      apellido,
      genero,
      email,
      telefono,
      puesto,
      salario: salario || 0,
    };

    try {
      const user = AuthService.getCurrentUser();
      console.log("En Empleado - Token:", localStorage.getItem("token"));
      console.log("En Empleado - User:", localStorage.getItem("user"));
      console.log("En Empleado - getCurrentUser result:", user);
      if (!user || !user.token) {
        toast({
          title: "Error",
          description: "No hay sesión activa",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      };

      if (empleadoId) {
        await axiosInstance.put(`/empleados/${empleadoId}`, empleado, config);
      } else {
        await axiosInstance.post("/empleados", empleado, config);
      }

      cargarEmpleados();
      resetForm();
      toast({
        title: "Éxito",
        description: "Empleado guardado con éxito",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description:
          error.response?.status === 403
            ? "No tienes permiso para guardar el empleado"
            : "Error al guardar el empleado",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const resetForm = () => {
    setEmpleadoId(null);
    setNombre("");
    setApellido("");
    setGenero("Masculino");
    setEmail("");
    setTelefono("");
    setPuesto("Mesero");
    setSalario(undefined);
  };

  const editarEmpleado = async (id: number) => {
    try {
      const user = AuthService.getCurrentUser();
      if (!user || !user.token) {
        toast({
          title: "Error",
          description: "No hay sesión activa",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axiosInstance.get(`/empleados/${id}`, config);
      const empleado = response.data;

      setEmpleadoId(empleado.id_empleado);
      setNombre(empleado.nombre);
      setApellido(empleado.apellido);
      setGenero(empleado.genero);
      setEmail(empleado.email);
      setTelefono(empleado.telefono);
      setPuesto(empleado.puesto);
      setSalario(empleado.salario);
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description:
          error.response?.status === 403
            ? "No tienes permisos para editar este empleado"
            : "Error al cargar empleado para editar",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const eliminarEmpleado = async (id: number) => {
    if (window.confirm("¿Está seguro de que desea eliminar este empleado?")) {
      try {
        const user = AuthService.getCurrentUser();
        if (!user || !user.token) {
          toast({
            title: "Error",
            description: "No hay sesión activa",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        };

        await axiosInstance.delete(`/empleados/${id}`, config);
        cargarEmpleados();
        toast({
          title: "Éxito",
          description: "Empleado eliminado con éxito",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error: any) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description:
            error.response?.status === 403
              ? "No tienes permisos para eliminar este empleado"
              : "Error al eliminar empleado",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleCancel = () => {
    resetForm();
    navigate("/");
  };

  return (
    <div className="container-fluid py-4 mt-10" style={{ backgroundColor: '#f5e8c7', minHeight: '100vh' }}>
      <style>
        {`
          .btn-primary, .btn-primary:hover, .btn-primary:active, .btn-primary:focus {
            background-color: #6d4c41;
            border-color: #6d4c41;
          }
          .btn-secondary, .btn-secondary:hover, .btn-secondary:active, .btn-secondary:focus {
            background-color: #8d6e63;
            border-color: #8d6e63;
          }
          .card {
            background-color: #fff;
            border: none;
            border-radius: 15px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .card-title {
            color: #6d4c41;
            margin-bottom: 1rem;
          }
          .table-light {
            background-color: #f5e8c7;
          }
          .form-control:focus, .form-select:focus {
            border-color: #6d4c41;
            box-shadow: 0 0 0 0.2rem rgba(109, 76, 65, 0.25);
          }
            h1 {
            font-size: 7rem;
            margin-bottom: 2rem;
          }
          .card-body {
            padding: 1.80rem;
          }
            .custom-margin {
           margin-top: 50px; /* Ajusta el valor según lo que necesites */
          }
        `}
      </style>
      <h1 className="text-center mb-4" style={{ color: '#6d4c41' }}>Gestión de Empleados</h1>
      <div className="row">
        <div className="col-lg-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">{empleadoId ? 'Editar Empleado' : 'Nuevo Empleado'}</h2>
              <form onSubmit={handleSubmit}>
                <input type="hidden" value={empleadoId || ''} />
                <div className="mb-2">
                  <label htmlFor="nombre" className="form-label">Nombre</label>
                  <input type="text" className="form-control" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>
                <div className="mb-2">
                  <label htmlFor="apellido" className="form-label">Apellido</label>
                  <input type="text" className="form-control" id="apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
                </div>
                <div className="mb-2">
                  <label htmlFor="genero" className="form-label">Género</label>
                  <select className="form-select" id="genero" value={genero} onChange={(e) => setGenero(e.target.value)} required>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-2">
                  <label htmlFor="telefono" className="form-label">Teléfono</label>
                  <input type="tel" className="form-control" id="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                </div>
                <div className="mb-2">
                  <label htmlFor="puesto" className="form-label">Puesto</label>
                  <select className="form-select" id="puesto" value={puesto} onChange={(e) => setPuesto(e.target.value)} required>
                    <option value="Mesero">Mesero</option>
                    <option value="Cocinero">Cocinero</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label htmlFor="salario" className="form-label">Salario</label>
                  <input type="number" className="form-control" id="salario" value={salario} onChange={(e) => setSalario(parseFloat(e.target.value))} required />
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <button type="button" className="btn btn-sm btn-secondary me-2" onClick={handleCancel}>Cancelar</button>
                  <button type="submit" className="btn btn-sm btn-primary">Guardar Empleado</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">Lista de Empleados</h2>
              <div className="table-responsive">
                <table className="table table-hover table-sm">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Género</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>Puesto</th>
                      <th>Salario</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {empleados.map((empleado) => (
                      <tr key={empleado.id_empleado}>
                        <td>{empleado.id_empleado}</td>
                        <td>{empleado.nombre}</td>
                        <td>{empleado.apellido}</td>
                        <td>{empleado.genero}</td>
                        <td>{empleado.email}</td>
                        <td>{empleado.telefono}</td>
                        <td>{empleado.puesto}</td>
                        <td>${empleado.salario.toFixed(2)}</td>
                        <td>
                          <button onClick={() => editarEmpleado(empleado.id_empleado)} className="btn btn-sm btn-warning me-2">
                            <i className="bi bi-pencil"></i> Editar
                          </button>
                          <button onClick={() => eliminarEmpleado(empleado.id_empleado)} className="btn btn-sm btn-danger me-2">
                            <i className="bi bi-trash"></i> Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpleadoComponent;

