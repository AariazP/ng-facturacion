import { CanActivate, Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { HttpLoginService } from '../services/http-services/httpLogin.service'; 

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  private router: Router = inject(Router);

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
