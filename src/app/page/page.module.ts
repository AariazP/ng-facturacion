import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageRoutingModule } from './page-routing.module';
import { CajaComponent } from './caja/caja.component';
import { FacturacionComponent } from './facturacion/facturacion.component';


@NgModule({
  declarations: [
  
    CajaComponent,
    FacturacionComponent
  ],
  imports: [
    CommonModule,
    PageRoutingModule
  ]
})
export class PageModule { }
