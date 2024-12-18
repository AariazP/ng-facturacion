import { inject, Injectable } from '@angular/core';
import { environment } from '../../env/env';
import { HttpClient } from '@angular/common/http';
import { CrearVentaDTO } from '../../dto/venta/CrearVentaDTO';
import { Observable } from 'rxjs';
import { VentaDTO } from '../../dto/venta/VentaDTO';
import { FullVentaDTO } from '../../dto/venta/FullVentaDTO';

@Injectable({
  providedIn: 'root'
})
export class HttpVentaService {

  private URL_API: string = environment.ApiUrl;
  private http: HttpClient = inject(HttpClient);
  
  public obtenerVentas(): Observable<VentaDTO[]> {
    return this.http.get<VentaDTO[]>(`${this.URL_API}/venta/obtener-ventas-completadas`); 
  }
  
  public generaIdVenta(): Observable<number>{
    return this.http.get<number>(`${this.URL_API}/venta/siguiente-id`);
  }

  public eliminarPorId(id: number) {
    return this.http.get(`${this.URL_API}/venta/${id}`);
  }

  public guardarFactura(factura: CrearVentaDTO) {
    return this.http.post(`${this.URL_API}/venta/guardar`, factura);
  }

  public obtenerDetalleVenta(id: number): Observable<FullVentaDTO> {
    return this.http.get<FullVentaDTO>(`${this.URL_API}/venta/${id}`);
  }

  public cancelarVenta(idVenta: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.URL_API}/venta/cancelar/${idVenta}`);
  }

}
