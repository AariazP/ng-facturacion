import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoComponent } from './producto/producto.component';
import { NuevoComponent } from '../components/clientes/nuevo/nuevo.component';
import { NuevoProductoComponent } from '../components/productos/nuevo-producto/nuevo-producto.component';
import { ClienteComponent } from './cliente/cliente.component';
import { PrincipalComponent } from './principal/principal.component';
import { CajaComponent } from './caja/caja.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { AuthGuard } from '../guards/guard.guard';
import { ListaVentasComponent } from '../components/venta/lista-ventas/listaVentas.component';
import { VentaComponent } from '../components/venta/venta/venta.component';
import { FacturacionElectronicaComponent } from './facturacion-electronica/facturacion-electronica.component';

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
      path: 'venta',
      canActivate: [AuthGuard],
      component: VentaComponent
    },
    {
      path: 'lista-ventas',
      canActivate: [AuthGuard],
      component: ListaVentasComponent
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
      path: 'configuracion',
      canActivate: [AuthGuard],
      component: ConfiguracionComponent
    },
    {
      path: 'facturacion-electronica',
      canActivate: [AuthGuard],
      component: FacturacionElectronicaComponent
    }

    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }
