export class FacturaItemDTO{

    cedulaCliente!: string;
    fechaHora!: Date;
    total!: number;
    idFactura!: number;

    constructor(cedulaCliente: string, fechaHora: Date, total: number, idFactura: number){
        this.cedulaCliente = cedulaCliente;
        this.fechaHora = fechaHora;
        this.total = total;
        this.idFactura = idFactura;
    }
}