import { CanActivate, Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class loginGuard implements CanActivate {
  
  private router: Router = inject(Router);

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
