import { Injectable } from "@angular/core";
import { HttpClientesService } from "../http-services/httpClientes.service";
import { CrearClienteDTO } from "../dto/cliente/CrearClienteDTO";
import { AlertService } from "../utils/alert.service";
import { ClienteDTO } from "../dto/cliente/ClienteDTO";
import { catchError, Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
export class ClienteService {
  
  
    
  constructor(private clientesService: HttpClientesService, private alertService: AlertService) {}

  crearCliente(cliente: CrearClienteDTO){
    return this.clientesService.crearCliente(cliente).subscribe({
      next: () => this.alertService.simpleSuccessAlert("Cliente guardado correctamente"),
      error: () => this.alertService.simpleErrorAlert("Error al guardar cliente") 
    });
  }

  obtenerCliente(cedula: string): Observable <ClienteDTO | null>{
    return this.clientesService.obtenerCliente(cedula).pipe(
      catchError(() => {
        return of(null); 
      })
    );
  }

  fueEliminado(input: string) {
    return this.clientesService.fueEliminado(input).pipe(
      catchError(() => {
        return of(null); 
      })
    );
  }

  recuperarCliente(input: string) {
    return this.clientesService.recuperarCliente(input).subscribe({
      next: () => this.alertService.simpleSuccessAlert("Cliente recuperado correctamente"),
      error: () => this.alertService.simpleErrorAlert("Error al recuperar cliente") 
    }); 
  }

}