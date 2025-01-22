import { inject, Injectable } from "@angular/core";
import { HttpProductoService } from "../http-services/httpProductos.service";
import { Observable } from "rxjs";
import { AlertService } from "src/app/utils/alert.service";
import { ProductoDTO } from "src/app/dto/producto/ProductoDTO";
import { ActualizarProductoDTO } from "src/app/dto/producto/ActualizarProductoDTO";
import { CrearProductoDTO } from "src/app/dto/producto/CrearProductoDTO";
import { Page } from "src/app/dto/pageable/Page";
import { HttpVentaService } from "../http-services/httpVenta.service";
import { VentaDTO } from '../../dto/venta/VentaDTO';

@Injectable({
    providedIn: 'root'
})
export class CajaService {
    
    private httpVentaService: HttpVentaService = inject(HttpVentaService);
    private alert: AlertService = inject(AlertService);

    /**
     * Este método se encarga de obtener las ventas de la base de datos
     * @returns un observable de tipo VentaDTO
     */
    public getVentas (page:number): Observable<Page<VentaDTO>> {
        return this.httpVentaService.obtenerVentas(page);
    }

    preguntarLimpiarCaja () {
        return this.alert.confirmAlert('¿Está seguro que desea limpiar todos los datos de la caja?', 'Esta acción no se puede deshacer');
    }
}