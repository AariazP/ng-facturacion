import {FormGroup } from "@angular/forms";

export class FormaVenta{


    nombre!: string;
    precio!: number;
    cantidad!: number;
    activo!: boolean;


    static toEntity(forma: FormGroup): FormaVenta {
        let formaVenta = new FormaVenta();
        console.log(forma);
        formaVenta.nombre = forma.get('nombre')?.value;
        formaVenta.precio = forma.get('precio')?.value;
        formaVenta.cantidad = forma.get('cantidad')?.value;
        formaVenta.activo = true;
        return formaVenta;
    }
}