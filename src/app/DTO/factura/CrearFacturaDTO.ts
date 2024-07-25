import { DetalleFacturaDTO } from "./DetalleFacturaDTO";

export class CrearFacturaDTO {

    cliente!: string;
    listDetalleFactura!: DetalleFacturaDTO[];
    usuario!: number;

    constructor() {
        this.listDetalleFactura = [];
    }


    agregarDetalle(detalleFactura: DetalleFacturaDTO) {
        let productoExistente = false;
        this.listDetalleFactura.forEach(detalle => {
            if (detalle.codigoProducto === detalleFactura.codigoProducto) {
                detalle.cantidad += detalleFactura.cantidad;
                productoExistente = true;
            }
        });

        if (!productoExistente) {
            this.listDetalleFactura.push(detalleFactura);
        }
    }
}