import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoComponent } from './producto/producto.component';
import { FacturaComponent } from './factura/factura.component';
import { NuevoComponent } from '../components/clientes/nuevo/nuevo.component';
import { NuevoProductoComponent } from '../components/productos/nuevo-producto/nuevo-producto.component';
import { Cod404Component } from '../components/cod404/cod404.component';
import { ClienteComponent } from './cliente/cliente.component';
import { PrincipalComponent } from './principal/principal.component';
import { CajaComponent } from './caja/caja.component';
import { FacturacionComponent } from './facturacion/facturacion.component';
import { ListaFacturasComponent } from '../components/facturas/lista-facturas/lista-facturas.component';
import { AuthGuard } from '../guards/guard.guard';

const routes: Routes = [

    {
      path: 'cliente',
      canActivate: [AuthGuard],
      component: ClienteComponent
    },
    {
      path: 'cliente/nuevo',
      canActivate: [AuthGuard],
      component: NuevoComponent
    },
    {
      path: 'producto',
      canActivate: [AuthGuard],
      component: ProductoComponent
    },
    {
      path: 'producto/nuevo',
      canActivate: [AuthGuard],
      component: NuevoProductoComponent
    },
    {
      path: 'factura',
      canActivate: [AuthGuard],
      component: FacturaComponent
    },
    {
      path: 'lista-factura',
      canActivate: [AuthGuard],
      component: ListaFacturasComponent
    },
    {
      path: 'principal',
      canActivate: [AuthGuard],
      component: PrincipalComponent
    },
    {
      path: 'caja',
      canActivate: [AuthGuard],
      component: CajaComponent
    },
    {
      path: 'facturacion',
      canActivate: [AuthGuard],
      component: FacturacionComponent
    }

    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }
