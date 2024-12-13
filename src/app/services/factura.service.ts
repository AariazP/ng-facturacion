import { inject, Injectable } from "@angular/core";
import { AlertService } from "../utils/alert.service";
import { HttpFacturasService } from "../http-services/httpFacturas.service";

@Injectable({
    providedIn: 'root'
  })
export class FacturaService {

    private alertService: AlertService = inject(AlertService);
    private facturaService: HttpFacturasService = inject(HttpFacturasService);

    
}