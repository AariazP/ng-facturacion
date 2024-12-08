import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpLoginService } from '../http-services/httpLogin.service'; 

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private httploginService: HttpLoginService, private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('id');
    if (!token) {
      this.router.navigate(['/login']);
      return false; 
    } else {
      return true;
    } 
  }
}
