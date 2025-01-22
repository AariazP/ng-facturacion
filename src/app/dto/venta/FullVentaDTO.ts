import { FullDetalleDTO } from "../detalleVenta/FullDetalleDTO";

export class FullVentaDTO {

    id!:number;
    fecha!:string;
    total!:number;
    nombreCliente!:string;
    cedulaCliente!:string;
    direccionCliente!:string;
    correoCliente!:string;
    usuario!:number;
    dineroRecibido!:number;
    cambio!:number;
    descuento!:number;
    detalleVentaList!: FullDetalleDTO[];
}