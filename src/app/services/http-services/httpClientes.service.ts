import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../env/env';
import { CrearClienteDTO } from '../../dto/cliente/CrearClienteDTO';
import { ClienteDTO } from '../../dto/cliente/ClienteDTO';
@Injectable({
  providedIn: 'root'
})
export class HttpClientesService {
 

  private URL_API: string = environment.ApiUrl;
  private http: HttpClient = inject(HttpClient);

  public obtenerClientes(): Observable<ClienteDTO[]> {
    return this.http.get<ClienteDTO[]>(`${this.URL_API}/clientes`);
  }

  public crearCliente(cliente: CrearClienteDTO) {
    return this.http.post(`${this.URL_API}/clientes/guardar`, cliente);
  }

  public eliminarPorId(id: number) {
    return this.http.delete(`${this.URL_API}/clientes/eliminar/${id}`);
  }

  public actualizar(datos: any, id: number) {
    return this.http.put(`${this.URL_API}/clientes/actualizar/${id}`, datos);
  }
  public verificarExistencia(cedula: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.URL_API}/clientes/verificar-cliente/${cedula}`);
  }

  public obtenerCliente(cedula:string){
    return this.http.get<ClienteDTO>(`${this.URL_API}/clientes/${cedula}`);
  }

  public fueEliminado(cedula: string):Observable<boolean> {
    return this.http.get<boolean>(`${this.URL_API}/clientes/verificar-eliminado/${cedula}`);
  }

  public recuperarCliente(cedula: string):Observable<void> {
    return this.http.get<void>(`${this.URL_API}/clientes/recuperar-cliente/${cedula}`);
  }

}
