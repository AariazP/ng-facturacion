export class ActualizarClienteDTO{
   

    cedula!: string;
    direccion!: string;
    correo!: string;
    nombre!: string;
    activo!: boolean;

    actualizarCliente(cedula:string, nombre:string, direccion:string, correo:string, activo:boolean):ActualizarClienteDTO {
        this.cedula = cedula;
        this.nombre = nombre;
        this.direccion = direccion;
        this.correo = correo;
        this.activo = activo;
        return this;
    }

    static crearActualizarClienteDTO(cedula:string, nombre:string, direccion:string, correo:string, activo:boolean):ActualizarClienteDTO {
        let cliente = new ActualizarClienteDTO();
        return cliente.actualizarCliente(cedula, nombre, direccion, correo, activo); 
      }
}