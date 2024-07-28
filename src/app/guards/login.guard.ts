import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { LoginService } from '../service/login.service';

@Injectable({
  providedIn: 'root'
})
export class loginGuard implements CanActivate {
  
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('id');
    if (token) {
      this.router.navigate(['/app/cliente']); 
      return false; 
    } else {
      return true;
    }
  }
}
