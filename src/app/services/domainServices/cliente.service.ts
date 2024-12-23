import { inject, Injectable } from "@angular/core";
import { HttpClientesService } from "../http-services/httpClientes.service";
import { catchError, Observable, of, throwError } from "rxjs";
import { AlertService } from "src/app/utils/alert.service";
import { CrearClienteDTO } from "src/app/dto/cliente/CrearClienteDTO";
import { ClienteDTO } from "src/app/dto/cliente/ClienteDTO";
import { Page } from "src/app/dto/pageable/Page";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {


  private clienteService: HttpClientesService = inject(HttpClientesService);
  private alertService: AlertService = inject(AlertService);


  crearCliente(cliente: CrearClienteDTO) {
    return this.clienteService.crearCliente(cliente).subscribe({
      next: () => this.alertService.simpleSuccessAlert("Cliente guardado correctamente"),
      error: (error) => this.alertService.simpleErrorAlert(error.error.mensaje)
    });
  }

  obtenerCliente(cedula: string): Observable<ClienteDTO | null> {
    return this.clienteService.obtenerCliente(cedula).pipe(
      catchError(() => {
        return of(null);
      })
    );
  }

  /**
  * Este método se encarga de obtener los clientes de la base de datos
  * @returns un observable de tipo ClienteDTO
  */
  public getTodosClientes(): Observable<ClienteDTO[]> {
    this.clienteService.verificarCambios().subscribe({
      next: (resp) => {
        if (resp) {
          this.clienteService.getTodosLosClientes().subscribe({
            next: (resp) => {
              this.guardarLocal(resp);
            },
          });
        } else {
          this.obtenerClienteLocal
        }
      },
    });
    return of(this.obtenerClienteLocal())
  }

  guardarLocal(resp: ClienteDTO[]) {
    localStorage.setItem('clientes', JSON.stringify(resp));
  }

  /**
  * Este metodo obtiene los clientes del LocalStorage
  * devuelve una lista de ClientesDTO
  */
  obtenerClienteLocal(): ClienteDTO[] {
    const clientes = localStorage.getItem('clientes');

    if (!clientes) {
      // Si no hay clientes almacenados, devuelve un arreglo vacío
      return [];
    }
    // Si hay clientes, intenta parsearlos
    try {
      return JSON.parse(clientes);
    } catch (error) {
      console.error(
        'Error al parsear los clientes desde localStorage:',
        error
      );
      return []; // Devuelve un arreglo vacío si hay un error de formato
    }
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

  obtenerClientes(page: number): Promise<Page<ClienteDTO>> {
    return new Promise((resolve, reject) => {
      this.clienteService.obtenerClientes(page).subscribe({
        next: (page) => resolve(page),
        error: (error) => {
          this.alertService.simpleErrorAlert(error.error.mensaje);
          reject(error);
        }
      });
    });
  }

  getClientes(page: number): Observable<Page<ClienteDTO>> {
    return this.clienteService.obtenerClientes(page).pipe(
      catchError((error) => {
        this.alertService.simpleErrorAlert(error.error.mensaje);
        return throwError(error); // Importar throwError desde 'rxjs'
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