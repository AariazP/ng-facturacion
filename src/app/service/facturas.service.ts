import { Injectable } from '@angular/core';
import { environment } from '../env/env';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  private URL_API: string = environment.ApiUrl;

  constructor(private http: HttpClient) { }

  getData(){
    return this.http.get(`${this.URL_API}/factura`);
  }
  guardarCabecera(cabecera: any) {
    return this.http.post(`${this.URL_API}/factura`, cabecera);
  }

  guardarDetalles(detalles: any) {
    return this.http.post(`${this.URL_API}/factura/guardar`, detalles);
  }
  generaFactura(){
    return this.http.get(`${this.URL_API}/factura/siguiente-id`);
  }

  eliminarPorId(id: number) {
    return this.http.delete(`${this.URL_API}/factura/${id}`);
  }


}
