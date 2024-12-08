import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../env/env';
import { ResponseData } from 'src/app/interface/interfaces';
import { ClienteDTO } from '../DTO/cliente/ClienteDTO';
@Injectable({
  providedIn: 'root'
})
export class ClientesService {
 
  

  private URL_API: string = environment.ApiUrl;

  constructor(private http: HttpClient) { }

  obtenerClientes(): Observable<ClienteDTO[]> {
    return this.http.get<ClienteDTO[]>(`${this.URL_API}/clientes`);
  }

  enviarDatos(cliente: any) {
    return this.http.post(`${this.URL_API}/clientes/guardar`, cliente);
  }

  eliminarPorId(id: number) {
    const url = `${this.URL_API}/clientes/eliminar/${id}`;
    return this.http.delete(url);
  }

  actualizar(datos: any, id: number) {
    return this.http.put(`${this.URL_API}/clientes/actualizar/${id}`, datos);
  }
  verificarExistencia(cod: string) {
    return this.http.get<ResponseData>(`${this.URL_API}/clientes/verificar-cliente/${cod}`);
  }

  obtenerCliente(cedula:string){
    return this.http.get<any>(`${this.URL_API}/clientes/${cedula}`);
  }

  fueEliminado(input: any) {
    return this.http.get<ResponseData>(`${this.URL_API}/clientes/verificar-eliminado/${input}`);
  }

  recuperarCliente(input: any) {
    return this.http.get<ResponseData>(`${this.URL_API}/clientes/recuperar-cliente/${input}`);
  }

}
