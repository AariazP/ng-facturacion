import { Injectable } from '@angular/core';
import { environment } from '../env/env';
import { HttpClient } from '@angular/common/http';
import { CrearVentaDTO } from '../dto/venta/CrearVentaDTO';
import { Observable } from 'rxjs';
import { DetalleVentaDTO } from '../dto/detalleVenta/DetalleVentaDTO';


@Injectable({
  providedIn: 'root'
})
export class HttpVentaService {
  

  private URL_API: string = environment.ApiUrl;

  constructor(private http: HttpClient) { }

  public obtenerVentas(): Observable<DetalleVentaDTO> {
    return this.http.get<DetalleVentaDTO>(`${this.URL_API}/venta/obtener-ventas-completadas`); 
  }
  
  guardarCabecera(cabecera: any) {
    return this.http.post(`${this.URL_API}/venta`, cabecera);
  }

  guardarDetalles(detalles: any) {
    return this.http.post(`${this.URL_API}/venta/guardar`, detalles);
  }
  generaIdVenta(): Observable<number>{
    return this.http.get<number>(`${this.URL_API}/venta/siguiente-id`);
  }

  eliminarPorId(id: number) {
    return this.http.get(`${this.URL_API}/venta/${id}`);
  }

  guardarFactura(factura: CrearVentaDTO) {
    return this.http.post(`${this.URL_API}/venta/guardar`, factura);
  }

  obtenerDetalleVenta(id: any) {
    return this.http.get(`${this.URL_API}/venta/${id}`);
  }

}
