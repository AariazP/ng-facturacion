import { inject, Injectable } from "@angular/core";
import { HttpClientesService } from "../http-services/httpClientes.service";
import { CrearClienteDTO } from "../dto/cliente/CrearClienteDTO";
import { AlertService } from "../utils/alert.service";
import { ClienteDTO } from "../dto/cliente/ClienteDTO";
import { catchError, Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
export class ClienteService {
  

  private clienteService: HttpClientesService = inject(HttpClientesService);
  private alertService: AlertService = inject(AlertService);
    

  crearCliente(cliente: CrearClienteDTO){
    return this.clienteService.crearCliente(cliente).subscribe({
      next: () => this.alertService.simpleSuccessAlert("Cliente guardado correctamente"),
      error: (error) => this.alertService.simpleErrorAlert(error.error.mensaje) 
    });
  }

  obtenerCliente(cedula: string): Observable <ClienteDTO | null>{
    return this.clienteService.obtenerCliente(cedula).pipe(
      catchError(() => {
        return of(null); 
      })
    );
  }

  fueEliminado(input: string) {
    return this.clienteService.fueEliminado(input).pipe(
      catchError(() => {
        return of(null); 
      })
    );
  }

  recuperarCliente(input: string) {
    return this.clienteService.recuperarCliente(input).subscribe({
      next: () => this.alertService.simpleSuccessAlert("Cliente recuperado correctamente"),
      error: (error) => this.alertService.simpleErrorAlert(error.error.mensaje) 
    }); 
  }

  obtenerClientes() : Observable<ClienteDTO[]> {
    return this.clienteService.obtenerClientes().pipe(
      catchError(() => {
        return of([]); 
      })
    );
  }

  eliminarClienteId(id: number) {
    return this.clienteService.eliminarPorId(id).subscribe({
      next: () => this.alertService.simpleSuccessAlert("Cliente eliminado correctamente"),
      error: (error) => this.alertService.simpleErrorAlert(error.error.mensaje) 
    });
  }

}