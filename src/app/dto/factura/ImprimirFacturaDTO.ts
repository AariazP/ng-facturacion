import { environment } from "src/app/env/env";
import { FullVentaDTO } from "../venta/FullVentaDTO";
import { ProductoFacturaDTO } from "./productoFacturaDTO";

export class ImprimirFacturaDTO{
    

    //Exporto las variables de ambiente
    private static iva: number = environment.IVA;

    fecha!: string;
    fechaVenta!: string;
    cliente!: string;
    cc!: string;
    direccion!: string;
    correo!: string;
    productos!: ProductoFacturaDTO[];
    total!: number;
    cambio!: number;
    base!: number;
    descuento!: number;
    cufe!: string;
    iva!: number;
    dineroRecibido!: number;

    static crearFactura(venta: FullVentaDTO): ImprimirFacturaDTO {
        let factura = new ImprimirFacturaDTO();
        factura.fecha = new Date().toLocaleDateString();
        factura.fechaVenta = venta.fecha;
        factura.cliente = venta.nombreCliente;
        factura.cc = venta.cedulaCliente;
        factura.direccion = venta.direccionCliente;
        factura.correo = venta.correoCliente;
        factura.dineroRecibido = venta.dineroRecibido;
        factura.cambio = venta.cambio;
        factura.descuento = venta.descuento;
        ImprimirFacturaDTO.agregarProductos(venta, factura);
        factura.total = venta.total;
        factura.base = venta.total - venta.total*this.iva;
        factura.iva = venta.total * this.iva;
        factura.cufe = 'b015063ded3dd7d0aa9c5ea54bc088c800b6c25de46aaca068a2ce2930a27a166c435ae9c978b0f5c88bec073befece7'
        return factura;
    }

    private static agregarProductos(venta: FullVentaDTO, factura: ImprimirFacturaDTO) {
        factura.productos = venta.detalleVentaList.map(detalle => {
            let producto = new ProductoFacturaDTO(detalle.producto, detalle.cantidad, detalle.precio);
            return producto;
        });
    }
}