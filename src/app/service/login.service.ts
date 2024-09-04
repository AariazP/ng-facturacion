import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../env/env';
import { Observable, tap } from 'rxjs';
import { AlertService } from '../utils/alert.service';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private URL_API: string = environment.ApiUrl;

  constructor(private http: HttpClient) { }
  
  login(username: string, password: string): Observable<any> {
    let params = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.http.get<any>(this.URL_API+"/usuarios/login", { params });
  }

}
