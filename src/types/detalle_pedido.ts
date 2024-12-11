//Definir la interfaz del detalle pedido que refleja la entidad en la base de datos
// del back-end (../model/Detalle_Pedido.java)
export interface Detalle_Pedido {
    id_detalle: number; // Identificador único del detalle de pedido
    pedido: number; // Identificador del empleado
    producto: number; // Identificador del producto
    cantidad: number; // Cantidad del producto en el pedido
    subtotal: number; // Subtotal del producto en el pedido
    nota_detalle: string; // Nota adicional del detalle de pedido
    fecha_detalle: Date; // Fecha de registro del detalle de pedido
    estado_detalle: string; // Estado del detalle de pedido
    descuento: number; // Descuento aplicado al detalle de pedido
}