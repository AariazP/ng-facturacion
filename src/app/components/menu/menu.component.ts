import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  estadoMenu: boolean = false;

  toggleCollapse(): void {
    const sidebar = document.querySelector("#sidebar") as HTMLElement;
    sidebar.classList.toggle("collapsed");
    this.estadoMenu = !this.estadoMenu
  }

constructor(private router: Router){
  this.router.navigate(['/app/principal']);
}	

salir(){
  localStorage.removeItem('id');
  this.router.navigate(['/login']);
}

}