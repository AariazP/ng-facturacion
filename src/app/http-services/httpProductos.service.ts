import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../env/env';
import { ResponseData } from '../interface/interfaces';
import { ProductoDTO } from '../dto/producto/ProductoDTO';
@Injectable({
  providedIn: 'root'
})
export class HttpProductoService {
  
  
  private URL_API: string = environment.ApiUrl;

  constructor(private http: HttpClient) { }

  getProductos(): Observable<ProductoDTO[]> {
    return this.http.get<ProductoDTO[]>(`${this.URL_API}/productos`);
  }

  getTipoImpuesto(): Observable<string[]>  {
    return this.http.get<string[]>(`${this.URL_API}/productos/tipos-impuestos`);
  }

  enviarDatos(datos: any) {
    return this.http.post(`${this.URL_API}/productos/guardar`, datos);
  }

  eliminarPorCodigo(codigo: string) {
    const url = `${this.URL_API}/productos/eliminar/${codigo}`;
    return this.http.delete(url);
  }

  actualizar(datos: any) {
    return this.http.put(`${this.URL_API}/productos/actualizar`, datos);
  }

  verificarExistencia(cod: string) {
    return this.http.get<ResponseData>(`${this.URL_API}/productos/verificar-cod-producto/${cod}`);
  }
  disminuirStock(detalles: any) {
    return this.http.post(`${this.URL_API}/productos/disminuir-stock`, detalles);
  }

  verificarCantidad(cantidad: number, codigo: string) {
    return this.http.get<ResponseData>(`${this.URL_API}/productos/verificar-cantidad/${cantidad}/${codigo}`);
  }

  verificarActivo(codigo: any) {
    return this.http.get<ResponseData>(`${this.URL_API}/productos/verificar-activo/${codigo}`); 
  }

  fueEliminado(value: string) {
    return this.http.get<any>(`${this.URL_API}/productos/fue-eliminado/${value}`);
  }
  recuperarProducto(input: string) {
    return this.http.get<any>(`${this.URL_API}/productos/recuperar-producto/${input}`);
  }
}
