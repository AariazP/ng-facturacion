import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CrearFacturaDTO } from "src/app/dto/factura/CrearFacturaDTO";
import { FacturaDTO } from "src/app/dto/factura/FacturaDTO";
import { environment } from "src/app/env/env";

@Injectable({
    providedIn: 'root'
})
export class HttpFacturaService{
    
    private URL_API: string = environment.ApiUrl;
    private http: HttpClient = inject(HttpClient);

    public crearFactura(factura: CrearFacturaDTO): Observable<FacturaDTO> {
        return this.http.post<FacturaDTO>(`${this.URL_API}/factura/guardar`, factura);
    }

}