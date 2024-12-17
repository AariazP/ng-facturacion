export class ProductoDTO {
  
  codigo!: string;
  nombre!: string;
  precio!: number;
  cantidad!: number;
  activo!: boolean;
  fechaCreacion!: Date;

  static crearProductoDTO(codigo: any, nombre: any, precio: any, cantidad: number) {
    let producto = new ProductoDTO();
    producto.codigo = codigo;
    producto.nombre = nombre;
    producto.precio = precio;
    producto.cantidad = cantidad;
    producto.activo = true;
    producto.fechaCreacion = new Date();
    return producto;
  }
}