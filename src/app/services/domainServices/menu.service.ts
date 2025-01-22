import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  estadoMenu: boolean = false;

  toggleCollapse(): void {
    this.estadoMenu = !this.estadoMenu;
  }
}
    