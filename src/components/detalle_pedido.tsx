import React, { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";

const API_URL = 'http://localhost:8080/api';

interface Pedido {
  id_pedido: number;
  num_mesa: number;
}

interface Producto {
  id_producto: number;
  nombre: string;
  precio: number;
}

interface DetallePedido {
  id_detalle: number;
  pedido: Pedido;
  producto: Producto;
  cantidad: number;
  subtotal: number;
  nota_detalle: string;
  fecha_detalle: string;
  estado_detalle: string;
  descuento: number;
}

const DetallePedidoComponent: React.FC = () => {
  const [detalles, setDetalles] = useState<DetallePedido[]>([]);
  const [detallePedidoId, setDetallePedidoId] = useState<number | null>(null);
  const [pedidoId, setPedidoId] = useState<number>(0);
  const [productoId, setProductoId] = useState<number>(0);
  const [cantidad, setCantidad] = useState<number>(1);
  const [nota_detalle, setNotaDetalle] = useState("");
  const [fecha_detalle, setFechaDetalle] = useState("");
  const [estado_detalle, setEstadoDetalle] = useState("Pendiente");
  const [descuento, setDescuento] = useState<number>(0);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    cargarPedidos();
    cargarProductos();
    cargarDetallesPedidos();
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

  const cargarDetallesPedidos = async () => {
    try {
      const config = getAuthConfig();
      if (!config) return;
      const response = await axios.get(`${API_URL}/detalle-pedidos`, config);
      setDetalles(response.data);
    } catch (error: any) {
      console.error('Error al cargar detalles de pedidos:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los detalles de pedidos",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const detallePedido = {
      pedido: { id_pedido: pedidoId },
      producto: { id_producto: productoId },
      cantidad,
      subtotal: calcularSubtotal(),
      nota_detalle,
      fecha_detalle,
      estado_detalle,
      descuento
    };

    try {
      const config = getAuthConfig();
      if (!config) return;

      if (detallePedidoId) {
        await axios.put(`${API_URL}/detalle-pedidos/${detallePedidoId}`, detallePedido, config);
      } else {
        await axios.post(`${API_URL}/detalle-pedidos`, detallePedido, config);
      }

      cargarDetallesPedidos();
      resetForm();
      toast({
        title: "Éxito",
        description: "Detalle de pedido guardado con éxito",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: `Error al guardar detalle de pedido: ${error.response?.data?.message || error.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const resetForm = () => {
    setDetallePedidoId(null);
    setPedidoId(0);
    setProductoId(0);
    setCantidad(1);
    setNotaDetalle("");
    setFechaDetalle("");
    setEstadoDetalle("Pendiente");
    setDescuento(0);
  };

  const calcularSubtotal = (): number => {
    const producto = productos.find(p => p.id_producto === productoId);
    return producto ? producto.precio * cantidad : 0;
  };

  const editarDetallePedido = async (id: number) => {
    try {
      const config = getAuthConfig();
      if (!config) return;
      const response = await axios.get(`${API_URL}/detalle-pedidos/${id}`, config);
      const detalle = response.data;
      setDetallePedidoId(detalle.id_detalle);
      setPedidoId(detalle.pedido.id_pedido);
      setProductoId(detalle.producto.id_producto);
      setCantidad(detalle.cantidad);
      setNotaDetalle(detalle.nota_detalle || "");
      setFechaDetalle(detalle.fecha_detalle);
      setEstadoDetalle(detalle.estado_detalle);
      setDescuento(detalle.descuento);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: `Error al cargar detalle para editar: ${error.response?.data?.message || error.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const eliminarDetallePedido = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este detalle de pedido?')) {
      try {
        const config = getAuthConfig();
        if (!config) return;
        await axios.delete(`${API_URL}/detalle-pedidos/${id}`, config);
        cargarDetallesPedidos();
        toast({
          title: "Éxito",
          description: "Detalle de pedido eliminado con éxito",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error: any) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: `Error al eliminar detalle de pedido: ${error.response?.data?.message || error.message}`,
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
    <div className="container-fluid px-4 py-5" style={{ backgroundColor: '#f5e8c7', minHeight: '100vh', paddingTop: '2rem' }}>
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
            padding: 2.5rem;
          }
          h1 {
            font-size: 6rem;
            margin-bottom: 1rem;
          }
          .table th, .table td {
            padding: 1rem;
          }
        `}
      </style>
      <h1 className="text-center mb-4 mt-3" style={{ color: '#6d4c41' }}>Gestión de Detalles de Pedido</h1>
      <div className="row g-5">
        <div className="col-lg-5 mb-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">{detallePedidoId ? 'Editar Detalle de Pedido' : 'Nuevo Detalle de Pedido'}</h2>
              <form onSubmit={handleSubmit}>
                <input type="hidden" value={detallePedidoId || ''} />
                <div className="mb-3">
                  <label htmlFor="pedido" className="form-label">Pedido</label>
                  <select className="form-select" id="pedido" value={pedidoId} onChange={e => setPedidoId(Number(e.target.value))} required>
                    <option value="">Seleccione un pedido</option>
                    {pedidos.map(pedido => (
                      <option key={pedido.id_pedido} value={pedido.id_pedido}>
                        Pedido #{pedido.id_pedido} - Mesa {pedido.num_mesa}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
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
                <div className="mb-3">
                  <label htmlFor="cantidad" className="form-label">Cantidad</label>
                  <input type="number" className="form-control" id="cantidad" value={cantidad} onChange={e => setCantidad(Number(e.target.value))} required min="1" />
                </div>
                <div className="mb-3">
                  <label htmlFor="nota_detalle" className="form-label">Nota Detalle</label>
                  <textarea className="form-control" id="nota_detalle" value={nota_detalle} onChange={e => setNotaDetalle(e.target.value)}></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="fecha_detalle" className="form-label">Fecha</label>
                  <input type="date" className="form-control" id="fecha_detalle" value={fecha_detalle} onChange={e => setFechaDetalle(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="estado_detalle" className="form-label">Estado</label>
                  <select className="form-select" id="estado_detalle" value={estado_detalle} onChange={e => setEstadoDetalle(e.target.value)} required>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Completado">Completado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="descuento" className="form-label">Descuento</label>
                  <input type="number" className="form-control" id="descuento" value={descuento} onChange={e => setDescuento(Number(e.target.value))} min="0" step="0.01" />
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <button type="button" className="btn btn-sm btn-secondary me-2" onClick={handleCancel}>Cancelar</button>
                  <button type="submit" className="btn btn-sm btn-primary">Guardar Detalle Pedido</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">Lista de Detalles de Pedido</h2>
              <div className="table-responsive">
                <table className="table table-hover table-sm">
                  <thead className="table-light">
                    <tr>
                      <th>ID Detalle</th>
                      <th>Pedido</th>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalles.map(detalle => (
                      <tr key={detalle.id_detalle}>
                        <td>{detalle.id_detalle}</td>
                        <td>Pedido #{detalle.pedido.id_pedido} - Mesa {detalle.pedido.num_mesa}</td>
                        <td>{detalle.producto.nombre}</td>
                        <td>{detalle.cantidad}</td>
                        <td>${detalle.subtotal.toFixed(2)}</td>
                        <td>{detalle.estado_detalle}</td>
                        <td>{detalle.fecha_detalle}</td>
                        <td>
                          <button onClick={() => editarDetallePedido(detalle.id_detalle)} className="btn btn-sm btn-warning me-2">
                            <i className="bi bi-pencil"></i> Editar
                          </button>
                          <button onClick={() => eliminarDetallePedido(detalle.id_detalle)} className="btn btn-sm btn-danger">
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

export default DetallePedidoComponent;

