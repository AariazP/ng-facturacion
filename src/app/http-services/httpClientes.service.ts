import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../env/env';
import { ResponseData } from 'src/app/interface/interfaces';
import { ClienteDTO } from '../dto/cliente/ClienteDTO';
import { CrearClienteDTO } from '../dto/cliente/CrearClienteDTO';
@Injectable({
  providedIn: 'root'
})
export class HttpClientesService {
 

  private URL_API: string = environment.ApiUrl;

  constructor(private http: HttpClient) { }

  obtenerClientes(): Observable<ClienteDTO[]> {
    return this.http.get<ClienteDTO[]>(`${this.URL_API}/clientes`);
  }

  crearCliente(cliente: CrearClienteDTO) {
    return this.http.post(`${this.URL_API}/clientes/guardar`, cliente);
  }

  eliminarPorId(id: number) {
    return this.http.delete(`${this.URL_API}/clientes/eliminar/${id}`);
  }

  actualizar(datos: any, id: number) {
    return this.http.put(`${this.URL_API}/clientes/actualizar/${id}`, datos);
  }
  verificarExistencia(cod: string) {
    return this.http.get<ResponseData>(`${this.URL_API}/clientes/verificar-cliente/${cod}`);
  }

  obtenerCliente(cedula:string){
    return this.http.get<ClienteDTO>(`${this.URL_API}/clientes/${cedula}`);
  }

  fueEliminado(input: any) {
    return this.http.get<ResponseData>(`${this.URL_API}/clientes/verificar-eliminado/${input}`);
  }

  recuperarCliente(input: any) {
    return this.http.get<ResponseData>(`${this.URL_API}/clientes/recuperar-cliente/${input}`);
  }

}
