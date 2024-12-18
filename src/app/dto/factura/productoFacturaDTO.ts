export class ProductoFacturaDTO {
    producto!: string;
    cantidad!: number;
    precio!: number;

    constructor(producto: string, cantidad: number, precio: number) {
        this.producto = producto;
        this.cantidad = cantidad;
        this.precio = precio;
    }
}