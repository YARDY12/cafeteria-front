//Definir la interfaz del producto que refleja la entidad en la base de datos
// del back-end (../model/Producto.java)
export interface Producto {
    id_producto: number;// Identificador unico
    nombre: string;// El nombre del producto
    descripcion: string;// La descripcion del producto
    precio: number;// El precio del producto
    categoria: string;// La categoria del producto
    estado_producto: string;// El estado del producto
    tamaño: string;// El tamaño del producto
    fecha_registro: Date;// La fecha de registro del producto
    alergenos: string;// Los alergenos del producto
}