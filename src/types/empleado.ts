//Definir la interfaz del empleado que refleja la entidad en la base de datos
// del back-end (../model/Empleado.java)
export interface Empleado {
    id_empleado: number;// Identificador unico
    nombre: string;// Nombre del empleado
    apellido: string;// Apellido del empleado
    genero: string;// Genero del empleado
    email: string;// Correo electronico del empleado
    telefono: string;// Telefono del empleado
    puesto: string;// Puesto del empleado
    salario: number;// Salario del empleado
}