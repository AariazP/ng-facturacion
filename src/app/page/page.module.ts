import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageRoutingModule } from './page-routing.module';
import { CajaComponent } from './caja/caja.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { MenuComponent } from '../components/menu/menu.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PageRoutingModule
  ]
})
export class PageModule { }
