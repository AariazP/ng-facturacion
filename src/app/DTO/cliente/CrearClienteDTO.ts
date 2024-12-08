export class CrearClienteDTO {

    cedula!: string;
    direccion!: string;
    correo!: string;
    nombre!: string;


    crearCliente(cedula:string, nombre:string, direccion:string, correo:string):CrearClienteDTO {
        this.cedula = cedula;
        this.nombre = nombre;
        this.direccion = direccion;
        this.correo = correo;
        return this;
    }

}