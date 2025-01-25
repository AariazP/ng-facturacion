import { FormArray } from "@angular/forms";
import { FormaVenta } from "../formasVenta/FormaVenta";

export class CrearProductoDTO {
    
    codigo!: string;
    nombre!: string;
    activo!: boolean;
    impuesto!: string;
    precioCompra!: number;
    formasVenta!: FormaVenta[];

    static crearProductoDTO(codigo: string, nombre: string, impuesto: string, 
      precioCompra: number, formasVenta: FormaVenta[]): CrearProductoDTO {

      let producto = new CrearProductoDTO();
      producto.codigo = codigo;
      producto.nombre = nombre;
      producto.activo = true;
      producto.impuesto = impuesto;
      producto.precioCompra = precioCompra;
      producto.formasVenta = formasVenta;
      return producto;
    }
}