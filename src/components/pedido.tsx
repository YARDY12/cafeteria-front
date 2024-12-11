import React, { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";

const API_URL = 'http://localhost:8080/api';

interface Empleado {
  id_empleado: number;
  nombre: string;
  apellido: string;
}

interface Producto {
  id_producto: number;
  nombre: string;
}

interface Pedido {
  id_pedido: number;
  num_mesa: number;
  nom_cliente: string;
  nota_especial?: string;
  total: number;
  empleado: Empleado;
  producto: Producto;
}

const PedidoComponent: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidoId, setPedidoId] = useState<number | null>(null);
  const [nom_cliente, setNomCliente] = useState("");
  const [num_mesa, setNumMesa] = useState<number>(1);
  const [empleadoId, setEmpleadoId] = useState<number>(0);
  const [productoId, setProductoId] = useState<number>(0);
  const [nota_especial, setNotaEspecial] = useState("");
  const [total, setTotal] = useState<number>(0);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    cargarEmpleados();
    cargarProductos();
    cargarPedidos();
  }, []);

  const getAuthConfig = () => {
    const user = AuthService.getCurrentUser();
    if (!user?.token) {
      toast({
        title: "Error",
        description: "No hay sesión activa",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return null;
    }
    return {
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  const cargarEmpleados = async () => {
    try {
      const config = getAuthConfig();
      if (!config) return;
      const response = await axios.get(`${API_URL}/empleados`, config);
      setEmpleados(response.data);
    } catch (error: any) {
      console.error('Error al cargar empleados:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los empleados",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const cargarProductos = async () => {
    try {
      const config = getAuthConfig();
      if (!config) return;
      const response = await axios.get(`${API_URL}/productos`, config);
      setProductos(response.data);
    } catch (error: any) {
      console.error('Error al cargar productos:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const cargarPedidos = async () => {
    try {
      const config = getAuthConfig();
      if (!config) return;
      const response = await axios.get(`${API_URL}/pedidos`, config);
      setPedidos(response.data);
    } catch (error: any) {
      console.error('Error al cargar pedidos:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los pedidos",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pedido = {
      num_mesa,
      nom_cliente,
      nota_especial,
      total,
      empleado: { id_empleado: empleadoId },
      producto: { id_producto: productoId }
    };

    try {
      const config = getAuthConfig();
      if (!config) return;
      
      if (pedidoId) {
        await axios.put(`${API_URL}/pedidos/${pedidoId}`, pedido, config);
      } else {
        await axios.post(`${API_URL}/pedidos`, pedido, config);
      }

      cargarPedidos();
      resetForm();
      toast({
        title: "Éxito",
        description: "Pedido guardado con éxito",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: `Error al guardar pedido: ${error.response?.data?.message || error.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const resetForm = () => {
    setPedidoId(null);
    setNomCliente("");
    setNumMesa(1);
    setEmpleadoId(0);
    setProductoId(0);
    setNotaEspecial("");
    setTotal(0);
  };

  const editarPedido = async (id: number) => {
    try {
      const config = getAuthConfig();
      if (!config) return;
      const response = await axios.get(`${API_URL}/pedidos/${id}`, config);
      const pedido = response.data;
      setPedidoId(pedido.id_pedido);
      setNomCliente(pedido.nom_cliente);
      setNumMesa(pedido.num_mesa);
      setNotaEspecial(pedido.nota_especial || "");
      setTotal(pedido.total);
      setEmpleadoId(pedido.empleado.id_empleado);
      setProductoId(pedido.producto.id_producto);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: `Error al cargar pedido para editar: ${error.response?.data?.message || error.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const eliminarPedido = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este pedido?')) {
      try {
        const config = getAuthConfig();
        if (!config) return;
        await axios.delete(`${API_URL}/pedidos/${id}`, config);
        cargarPedidos();
        toast({
          title: "Éxito",
          description: "Pedido eliminado con éxito",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error: any) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: `Error al eliminar pedido: ${error.response?.data?.message || error.message}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleCancel = () => {
    resetForm();
    navigate('/');
  };

  return (
    <div className="container-fluid py-5 mt-18" style={{ backgroundColor: '#f5e8c7', minHeight: '100vh' }}>
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
            font-size: 1.5rem;
          }
          .table-light {
            background-color: #f5e8c7;
          }
          .form-control:focus, .form-select:focus {
            border-color: #6d4c41;
            box-shadow: 0 0 0 0.2rem rgba(109, 76, 65, 0.25);
          }
          .card-body {
            padding: 3rem;
          }
          h1 {
            font-size: 6rem;
            margin-bottom: 2rem;
          }
          .table th, .table td {
            padding: 1rem;
          }
            body {
           background-color: #f5e8c7;
          }
        `}
      </style>
      <h1 className="text-center mb-4" style={{ color: '#6d4c41' }}>Gestión de Pedidos</h1>
      <div className="row g-4">
        <div className="col-lg-5 mb-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">{pedidoId ? 'Editar Pedido' : 'Nuevo Pedido'}</h2>
              <form onSubmit={handleSubmit}>
                <input type="hidden" value={pedidoId || ''} />
                <div className="mb-2">
                  <label htmlFor="nom_cliente" className="form-label">Nombre del Cliente</label>
                  <input type="text" className="form-control" id="nom_cliente" value={nom_cliente} onChange={e => setNomCliente(e.target.value)} required />
                </div>
                <div className="mb-2">
                  <label htmlFor="num_mesa" className="form-label">Número de Mesa</label>
                  <input type="number" className="form-control" id="num_mesa" value={num_mesa} onChange={e => setNumMesa(Math.max(1, parseInt(e.target.value)))} required min="1" />
                </div>
                <div className="mb-2">
                  <label htmlFor="empleado" className="form-label">Mesero</label>
                  <select className="form-select" id="empleado" value={empleadoId} onChange={e => setEmpleadoId(Number(e.target.value))} required>
                    <option value="">Seleccione un empleado</option>
                    {empleados.map(empleado => (
                      <option key={empleado.id_empleado} value={empleado.id_empleado}>
                        {empleado.nombre} {empleado.apellido}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label htmlFor="producto" className="form-label">Producto</label>
                  <select className="form-select" id="producto" value={productoId} onChange={e => setProductoId(Number(e.target.value))} required>
                    <option value="">Seleccione un producto</option>
                    {productos.map(producto => (
                      <option key={producto.id_producto} value={producto.id_producto}>
                        {producto.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label htmlFor="nota_especial" className="form-label">Nota Especial</label>
                  <textarea className="form-control" id="nota_especial" value={nota_especial} onChange={e => setNotaEspecial(e.target.value)}></textarea>
                </div>
                <div className="mb-2">
                  <label htmlFor="total" className="form-label">Total</label>
                  <input type="number" className="form-control" id="total" value={total} onChange={e => setTotal(Math.max(0, parseFloat(e.target.value)))} required min="0" step="0.01" />
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <button type="button" className="btn btn-sm btn-secondary me-2" onClick={handleCancel}>Cancelar</button>
                  <button type="submit" className="btn btn-sm btn-primary">Guardar Pedido</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">Lista de Pedidos</h2>
              <div className="table-responsive">
                <table className="table table-hover table-sm">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Mesa</th>
                      <th>Cliente</th>
                      <th>Mesero</th>
                      <th>Producto</th>
                      <th>Total</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map(pedido => (
                      <tr key={pedido.id_pedido}>
                        <td>{pedido.id_pedido}</td>
                        <td>{pedido.num_mesa}</td>
                        <td>{pedido.nom_cliente}</td>
                        <td>{pedido.empleado.nombre} {pedido.empleado.apellido}</td>
                        <td>{pedido.producto.nombre}</td>
                        <td>${pedido.total.toFixed(2)}</td>
                        <td>
                          <button onClick={() => editarPedido(pedido.id_pedido)} className="btn btn-sm btn-warning me-2">
                            <i className="bi bi-pencil"></i> Editar
                          </button>
                          <button onClick={() => eliminarPedido(pedido.id_pedido)} className="btn btn-sm btn-danger">
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

export default PedidoComponent;

