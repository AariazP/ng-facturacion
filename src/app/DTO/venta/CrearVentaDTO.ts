import { DetalleVentaDTO } from "../detalleVenta/DetalleVentaDTO";

export class CrearVentaDTO {

    cliente!: string;
    listDetalleVenta!: DetalleVentaDTO[];
    usuario!: number;

    constructor() {
        this.listDetalleVenta = [];
    }


    public agregarDetalle(detalleFactura: DetalleVentaDTO) {
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