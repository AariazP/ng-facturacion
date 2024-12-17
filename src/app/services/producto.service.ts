import { inject, Injectable } from "@angular/core";
import { HttpProductoService } from "../http-services/httpProductos.service";
import { Observable } from "rxjs";
import { ProductoDTO } from "../dto/producto/ProductoDTO";
import { AlertService } from "../utils/alert.service";

@Injectable({
    providedIn: 'root'
})
export class ProductoService {


    private httpProductoService: HttpProductoService = inject(HttpProductoService);
    private alert: AlertService = inject(AlertService);

    /**
     * Este método se encarga de obtener los productos de la base de datos
     * @returns un observable de tipo ProductoDTO
     */
    public getProductos(): Observable<ProductoDTO[]> {
        return this.httpProductoService.getProductos();
    }

    /**
     * Este método se encarga de verificar si un producto está activo
     * @param codigo es el código del producto a verificar
     * @returns un booleano que indica si el producto está activo
     */
    public verificarProductoActivo(codigo: string): boolean {
        this.httpProductoService.verificarActivo(codigo).subscribe(
            (response) => {
                if (!response) this.alert.simpleErrorAlert('El producto no está activo');
                return response;
            }
        )
        return true;
    }

    /**
     * Este método se encarga de verificar si un producto tiene suficiente cantidad
     * @param cantidad Cantidad de producto a verificar
     * @param codigo Código del producto a verificar
     * @returns un booleano que indica si el producto tiene suficiente cantidad
     */
    public verificarProductoCantidad(cantidad: number, codigo: string): boolean {
        this.httpProductoService.verificarCantidad(cantidad, codigo).subscribe(
            (response) => {
                if (!response) this.alert.simpleErrorAlert('No hay suficiente cantidad de producto');
                return response;
            }
        )
        return true;

    }

    /**
     * Este metodo se encarga de eliminar un producto por su id, muestra un mensaje de confirmación antes de eliminar
     * @param id es el id del producto a eliminar
     * @returns un booleano que indica si el producto fue eliminado
     */

    public eliminarPorId(id: number): boolean {
        let result = false;
        this.alert.confirmAlert('¿Está seguro de eliminar este producto?', 'Este cambio no se puede revertir').then((result) => {

            if (result) result=this.eliminarPorIdConfirmado(id);
            else {
                this.alert.simpleInfoAlert('Operación cancelada');
                result= false;
            }

        }
        );
        return result;
    }

    /**
     * Este metodo se encarga de eliminar un producto por su id sin mostrar un mensaje de confirmación
     * @param id  es el id del producto a eliminar
     * @returns  un booleano que indica si el producto fue eliminado
     */
    private eliminarPorIdConfirmado(id: number): boolean {
        let result = false;
        this.httpProductoService.eliminarPorId(id).subscribe({

            next: (response) => {
                if (response) {
                    this.alert.simpleSuccessAlert('Producto eliminado correctamente');
                    result = true;
                }
            }, error: (error) => { this.alert.simpleErrorAlert(error.error.mensaje); }
        }
        );
        return result;
    }
}