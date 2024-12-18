import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/app/env/env';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  public estadoMenu: boolean = false;
  private router: Router = inject(Router);
  protected nombreNegocio: string = environment.nombreNegocio;

  /**
   * Metodo que se encarga de colapsar el menu
   */
  public toggleCollapse(): void {
    const sidebar = document.querySelector("#sidebar") as HTMLElement;
    sidebar.classList.toggle("collapsed");
    this.estadoMenu = !this.estadoMenu
  }
  /**
   * Metodo que se encarga de navegar a la pagina principal
   * para cerrar la sesion
   */
  ngOnInit(): void {
    this.router.navigate(['/app/principal']);
  }

  /**
   * Metodo que se encarga de cerrar la sesion
   * eliminando el token del localstorage
   */
  protected salir() {
    localStorage.removeItem('id');
    this.router.navigate(['/login']);
  }

}