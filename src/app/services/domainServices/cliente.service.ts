import { inject, Injectable } from "@angular/core";
import { HttpClientesService } from "../http-services/httpClientes.service";
import { catchError, Observable, of } from "rxjs";
import { AlertService } from "src/app/utils/alert.service";
import { CrearClienteDTO } from "src/app/dto/cliente/CrearClienteDTO";
import { ClienteDTO } from "src/app/dto/cliente/ClienteDTO";

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

  async eliminarClienteId(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.clienteService.eliminarPorId(id).subscribe({
        next: () => {
          this.alertService.simpleSuccessAlert("Cliente eliminado correctamente");
          resolve();
        },
        error: (error) => {
          this.alertService.simpleErrorAlert(error.error.mensaje);
          reject(error);
        },
      });
    });
  }

  verificarExistencia(cedula: string): Observable<boolean> {
    return this.clienteService.verificarExistencia(cedula);
  }

}