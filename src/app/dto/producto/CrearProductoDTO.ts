export class CrearProductoDTO {
    
    codigo!: string;
    nombre!: string;
    precio!: number;
    cantidad!: number;
    activo!: boolean;
    impuesto!: string;

    static crearProductoDTO(codigo: string, nombre: string, 
      precio: string, stock: number, impuesto: string, activo: boolean): CrearProductoDTO {
      let producto = new CrearProductoDTO();
      producto.codigo = codigo;
      producto.nombre = nombre;
      producto.precio = Number(precio.replace(",", ""));
      producto.cantidad = stock;
      producto.activo = activo;
      producto.impuesto = impuesto;
      return producto;
    }
}