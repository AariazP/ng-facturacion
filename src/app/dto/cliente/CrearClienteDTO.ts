export class CrearClienteDTO {

    cedula!: string;
    direccion!: string;
    correo!: string;
    nombre!: string;


    static crearCliente(cedula:string, nombre:string, direccion:string, correo:string):CrearClienteDTO {
        let cliente = new CrearClienteDTO();
        cliente.cedula = cedula;
        cliente.nombre = nombre;
        cliente.direccion = direccion;
        cliente.correo = correo;
        return cliente;
    }

}