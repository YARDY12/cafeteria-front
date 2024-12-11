import React, { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import axiosInstance from "../utils/axiosConfig";
import { Producto } from "../types/producto";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

const API_URL = 'http://localhost:8080/api/productos';

const ProductoComponent: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoId, setProductoId] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState<number | undefined>(undefined);
  const [categoria, setCategoria] = useState("Bebidas Calientes");
  const [estado_producto, setEstadoProducto] = useState("Disponible");
  const [tamaño, setTamaño] = useState("");
  const [fecha_registro, setFechaRegistro] = useState("");
  const [alergenos, setAlergenos] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      console.log('Intentando cargar productos...');
      const response = await axiosInstance.get(API_URL);
      console.log('Respuesta:', response);
      setProductos(response.data);
    } catch (error: any) {
      console.error("Error completo:", error);
      console.error("Estado de la respuesta:", error.response?.status);
      toast({
        title: "Error",
        description:
          error.response?.status === 403
            ? "No tienes permiso para acceder a los productos"
            : "Error al cargar los productos",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const producto: Producto = {
      id_producto: productoId || 0,
      nombre,
      descripcion,
      precio: precio || 0,
      categoria,
      estado_producto,
      tamaño,
      fecha_registro: new Date(fecha_registro),
      alergenos,
    };

    try {
      const user = AuthService.getCurrentUser();
      if (!user || !user.token) {
        throw new Error("Usuario no autenticado");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      };

      if (productoId) {
        await axiosInstance.put(`${API_URL}/${productoId}`, producto, config);
        toast({
          title: "Éxito",
          description: "Producto actualizado correctamente",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await axiosInstance.post(API_URL, producto, config);
        toast({
          title: "Éxito",
          description: "Producto creado correctamente",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      cargarProductos();
      resetForm();
    } catch (error: any) {
      console.error("Error completo:", error);
      toast({
        title: "Error",
        description: "Error al guardar el producto",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const resetForm = () => {
    setProductoId(null);
    setNombre("");
    setDescripcion("");
    setPrecio(undefined);
    setCategoria("Bebidas Calientes");
    setEstadoProducto("Disponible");
    setTamaño("");
    setFechaRegistro("");
    setAlergenos("");
  };

  const editarProducto = async (id: number) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${id}`);
      const producto = response.data;
      setProductoId(producto.id_producto);
      setNombre(producto.nombre);
      setDescripcion(producto.descripcion);
      setPrecio(producto.precio);
      setCategoria(producto.categoria);
      setEstadoProducto(producto.estado_producto);
      setTamaño(producto.tamaño);
      setFechaRegistro(producto.fecha_registro.split('T')[0]);
      setAlergenos(producto.alergenos);
    } catch (error: any) {
      console.error("Error completo:", error);
      toast({
        title: "Error",
        description: "Error al cargar el producto",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const eliminarProducto = async (id: number) => {
    if (window.confirm("¿Está seguro de que desea eliminar este producto?")) {
      try {
        await axiosInstance.delete(`${API_URL}/${id}`);
        cargarProductos();
        toast({
          title: "Éxito",
          description: "Producto eliminado correctamente",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error: any) {
        console.error("Error completo:", error);
        toast({
          title: "Error",
          description: "Error al eliminar el producto",
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
    <div className="container-fluid py-5" style={{ backgroundColor: '#f5e8c7', minHeight: '100vh' }}>
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
          }
          .table-light {
            background-color: #f5e8c7;
          }
          .form-control:focus, .form-select:focus {
            border-color: #6d4c41;
            box-shadow: 0 0 0 0.2rem rgba(109, 76, 65, 0.25);
          }
        `}
      </style>
      <h1 className="text-center mb-5" style={{ color: '#6d4c41' }}>Gestión de Productos</h1>
      <div className="row">
        <div className="col-lg-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">{productoId ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <form onSubmit={handleSubmit}>
                <input type="hidden" value={productoId || ''} />

                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre</label>
                  <input type="text" className="form-control" id="nombre" placeholder="Escribe el nombre del producto" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>

                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label">Descripción</label>
                  <textarea className="form-control" id="descripcion" rows={3} placeholder="Descripción del producto" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
                </div>

                <div className="row mb-3">
                  <div className="col-sm-6 mb-3 mb-sm-0">
                    <label htmlFor="precio" className="form-label">Precio</label>
                    <input type="number" step="0.01" className="form-control" id="precio" value={precio} onChange={(e) => setPrecio(parseFloat(e.target.value))} required />
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="tamaño" className="form-label">Tamaño</label>
                    <input type="text" className="form-control" id="tamaño" value={tamaño} onChange={(e) => setTamaño(e.target.value)} required />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-sm-6 mb-3 mb-sm-0">
                    <label htmlFor="categoria" className="form-label">Categoría</label>
                    <select className="form-select" id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
                      <option value="Bebidas Calientes">Bebidas Calientes</option>
                      <option value="Bebidas Frías">Bebidas Frías</option>
                      <option value="Jugos">Jugos</option>
                      <option value="Batidos">Batidos</option>
                      <option value="Sandwich">Sandwich</option>
                      <option value="Wafle">Wafle</option>
                      <option value="Bowl">Bowl</option>
                      <option value="Postres">Postres</option>
                      <option value="Bolleria">Bolleria</option>
                    </select>
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="estado_producto" className="form-label">Estado del Producto</label>
                    <select className="form-select" id="estado_producto" value={estado_producto} onChange={(e) => setEstadoProducto(e.target.value)} required>
                      <option value="Disponible">Disponible</option>
                      <option value="No Disponible">No Disponible</option>
                    </select>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-sm-6 mb-3 mb-sm-0">
                    <label htmlFor="fecha_registro" className="form-label">Fecha de Registro</label>
                    <input type="date" className="form-control" id="fecha_registro" value={fecha_registro} onChange={(e) => setFechaRegistro(e.target.value)} required />
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="alergenos" className="form-label">Alérgenos</label>
                    <input type="text" className="form-control" id="alergenos" value={alergenos} onChange={(e) => setAlergenos(e.target.value)} />
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button type="button" className="btn btn-secondary me-2" onClick={handleCancel}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Guardar Producto</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">Lista de Productos</h2>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Precio</th>
                      <th>Categoría</th>
                      <th>Estado</th>
                      <th>Tamaño</th>
                      <th>Alérgenos</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map(producto => (
                      <tr key={producto.id_producto}>
                        <td>{producto.id_producto}</td>
                        <td>{producto.nombre}</td>
                        <td>{producto.descripcion}</td>
                        <td>${producto.precio.toFixed(2)}</td>
                        <td>{producto.categoria}</td>
                        <td>
                          <span className={`badge ${producto.estado_producto === 'Disponible' ? 'bg-success' : 'bg-danger'}`}>
                            {producto.estado_producto}
                          </span>
                        </td>
                        <td>{producto.tamaño}</td>
                        <td>{producto.alergenos}</td>
                        <td>
                          <button onClick={() => editarProducto(producto.id_producto)} className="btn btn-sm btn-warning me-2">
                            <i className="bi bi-pencil"></i> Editar
                          </button>
                          <button onClick={() => eliminarProducto(producto.id_producto)} className="btn btn-sm btn-danger">
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

export default ProductoComponent;

