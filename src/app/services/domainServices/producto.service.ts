import { inject, Injectable } from "@angular/core";
import { HttpProductoService } from "../http-services/httpProductos.service";
import { Observable, of } from "rxjs";
import { AlertService } from "src/app/utils/alert.service";
import { ProductoDTO } from "src/app/dto/producto/ProductoDTO";
import { ActualizarProductoDTO } from "src/app/dto/producto/ActualizarProductoDTO";
import { CrearProductoDTO } from "src/app/dto/producto/CrearProductoDTO";
import { Page } from "src/app/dto/pageable/Page";

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
    public getProductos(page: number): Observable<Page<ProductoDTO>> {
        return this.httpProductoService.getProductos(page);
    }

    /**
    * Este método se encarga de obtener los productos de la base de datos
    * @returns un observable de tipo ProductoDTO
    */
    public getTodosProductos(): Observable<ProductoDTO[]> {
        this.httpProductoService.verificarCambios().subscribe({
            next: (resp) => {
                if (resp) {
                    this.httpProductoService.getTodosLosProductos().subscribe({
                        next: (resp) => {
                            this.guardarLocal(resp);
                        },
                    });
                } else {
                    this.obtenerProductoLocal
                }
            },
        });
        return of(this.obtenerProductoLocal())
    }

    guardarLocal(resp: ProductoDTO[]) {
        localStorage.setItem('productos', JSON.stringify(resp));
    }

    /**
    * Este metodo obtiene los productos del LocalStorage
    * devuelve una lista de ProductoDTO
    */
    obtenerProductoLocal(): ProductoDTO[] {
        const productos = localStorage.getItem('productos');

        if (!productos) {
            // Si no hay productos almacenados, devuelve un arreglo vacío
            return [];
        }
        // Si hay productos, intenta parsearlos
        try {
            return JSON.parse(productos);
        } catch (error) {
            console.error(
                'Error al parsear los productos desde localStorage:',
                error
            );
            return []; // Devuelve un arreglo vacío si hay un error de formato
        }
    }

    /**
     * Este método se encarga de verificar si un producto está activo
     * @param codigo es el código del producto a verificar
     * @returns un booleano que indica si el producto está activo
     */
    public verificarProductoActivo(codigo: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.httpProductoService.verificarActivo(codigo).subscribe({
                next: (response) => {
                    if (!response) this.alert.simpleErrorAlert('El producto no está activo');
                    resolve(response);
                },
                error: (error) => {
                    this.alert.simpleErrorAlert('Error al verificar producto activo');
                    reject(false);
                }
            });
        });
    }

    /**
 * Este método se encarga de verificar si hay cambios
 * respecto a lo que sw tenía en la base de datos
 */
    public verificarCambios() {
        if (this.httpProductoService.verificarCambios()) {
            return true;
        }
        return false;
    }

    /**
     * Este método se encarga de verificar si un producto tiene suficiente cantidad
     * @param cantidad Cantidad de producto a verificar
     * @param codigo Código del producto a verificar
     * @returns un booleano que indica si el producto tiene suficiente cantidad
     */
    public verificarProductoCantidad(cantidad: number, codigo: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.httpProductoService.verificarCantidad(cantidad, codigo).subscribe({
                next: (response) => {
                    if (!response) this.alert.simpleErrorAlert('No hay suficiente cantidad de producto');
                    resolve(response);
                },
                error: (error) => {
                    this.alert.simpleErrorAlert('Error al verificar cantidad del producto');
                    reject(false);
                }
            });
        });

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

    /**
     * Este método se encarga de guardar un producto en la base de datos
     * @param producto es el producto a guardar
     */
    public guardarProducto(producto: CrearProductoDTO): void {
        this.httpProductoService.enviarDatos(producto).subscribe({
            next: () => { this.alert.simpleSuccessAlert('Producto guardado correctamente'); },
            error: (error) => {
                this.alert.simpleErrorAlert(error.error.mensaje);
            }
        });
    }

    /**
     * Este método obtiene los tipos de impuesto de la base de datos
     * @returns 
     */
    public getTipoImpuesto(): Observable<string[]> {
        return this.httpProductoService.getTipoImpuesto();
    }

    /**
     * Este método se encarga de verificar si un producto existe
     * y si fue eliminado anteriormente
     * @param codigo 
     * @returns 
     */
    public fueEliminado(codigo: string): Observable<boolean> {
        return this.httpProductoService.fueEliminado(codigo);
    }

    /**
     * Este método se encarga de recuperar un producto eliminado
     * @param codigo 
     */
    public recuperarProducto(codigo: string): Observable<boolean> {
        return this.httpProductoService.recuperarProducto(codigo);
    }

    /**
     * Este método se encarga de obtener un producto por su código
     * @param idProducto 
     */
    obtenerProductoPorCodigo(idProducto: string) {
        return this.httpProductoService.obtenerProductoPorCodigo(idProducto);
    }
}