import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageRoutingModule } from './page-routing.module';
import { CajaComponent } from './caja/caja.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';


@NgModule({
  declarations: [
  
    CajaComponent,
    ConfiguracionComponent
  ],
  imports: [
    CommonModule,
    PageRoutingModule
  ]
})
export class PageModule { }
