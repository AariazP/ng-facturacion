export class ActualizarProductoDTO {
    
    codigo!: string;
    nombre!: string;
    precio!: number;
    cantidad!: number;
    activo!: boolean;

    static crearProducto(codigo: string, nombre: string, precio: number, cantidad: number, activo: number): ActualizarProductoDTO {
        let producto = new ActualizarProductoDTO();
        producto.codigo = codigo;
        producto.nombre = nombre;
        producto.precio = precio;
        producto.cantidad = cantidad;
        producto.activo = activo == 1;
        return producto;
    }
}