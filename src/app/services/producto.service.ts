import { inject, Injectable } from "@angular/core";
import { HttpProductoService } from "../http-services/httpProductos.service";
import { Observable } from "rxjs";
import { ProductoDTO } from "../dto/producto/ProductoDTO";
import { AlertService } from "../utils/alert.service";
import { ActualizarProductoDTO } from "../dto/producto/ActualizarProductoDTO";

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

    public eliminarProductoCodigo(codigo: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.httpProductoService.eliminarPorCodigo(codigo).subscribe({
              next: () => {
                this.alert.simpleSuccessAlert("Cliente eliminado correctamente");
                resolve();
              },
              error: (error) => {
                this.alert.simpleErrorAlert(error.error.mensaje);
                reject(error);
              },
            });
          });
    }

    /**
     * Metodo para actualizar un producto en la base de datos
     * @param productoActualizar contiene los datos del producto a actualizar
     */
    public actualizar(productoActualizar: ActualizarProductoDTO): void {
        this.httpProductoService.actualizar(productoActualizar).subscribe({
            next: () => {
                this.alert.simpleSuccessAlert('Producto actualizado correctamente');
            },
            error: (error) => {
                this.alert.simpleErrorAlert(error.error.mensaje);
            }
        });
    }
}