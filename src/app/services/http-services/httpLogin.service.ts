import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../env/env';
import { Observable, tap } from 'rxjs';
import { UsuarioLoginDTO } from '../../dto/usuario/UsuarioLoginDTO';
import { UsuarioDTO } from '../../dto/usuario/UsuarioDTO';
@Injectable({
  providedIn: 'root'
})
export class HttpLoginService {
  private URL_API: string = environment.ApiUrl;

  constructor(private http: HttpClient) { }
  
  login(usuario:UsuarioLoginDTO): Observable<UsuarioDTO> {
    return this.http.post<UsuarioDTO>(this.URL_API+"/usuarios/login", usuario );
  }

}
