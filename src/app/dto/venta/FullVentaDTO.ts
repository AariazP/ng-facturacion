import { FullDetalleDTO } from "../detalleVenta/FullDetalleDTO";

export class FullVentaDTO {
    id!: number;
    fecha!: string;
    total!: number;
    cliente!: string;
    usuario!: number;
    detalles!: FullDetalleDTO[];
}