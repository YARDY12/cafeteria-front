//Definir la interfaz del pedido que refleja la entidad en la base de datos
// del back-end (../model/Pedido.java)
export interface Pedido {
    id_pedido: number;// Identificador unico
    empleado: number;// Identificador del empleado que realiza el pedido
    producto: number;// Identificador del producto
    num_mesa: number;// Numero de mesa
    nom_cliente: string;// Nombre del cliente
    nota_especial: string;// Nota especial
    total: number;// Total del pedido
}