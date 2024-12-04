import { DetalleFacturaDTO } from "./DetalleFacturaDTO";

export class CrearFacturaDTO {

    cliente!: string;
    listDetalleVenta!: DetalleFacturaDTO[];
    usuario!: number;

    constructor() {
        this.listDetalleVenta = [];
    }


    agregarDetalle(detalleFactura: DetalleFacturaDTO) {
        let productoExistente = false;
        this.listDetalleVenta.forEach(detalle => {
            if (detalle.codigoProducto === detalleFactura.codigoProducto) {
                detalle.cantidad += detalleFactura.cantidad;
                productoExistente = true;
            }
        });

        if (!productoExistente) {
            this.listDetalleVenta.push(detalleFactura);
        }
    }
}