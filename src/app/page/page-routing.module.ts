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

const routes: Routes = [

    {
      path: 'cliente',
      component: ClienteComponent
    },
    {
      path: 'cliente/nuevo',
      component: NuevoComponent
    },
    {
      path: 'producto',
      component: ProductoComponent
    },
    {
      path: 'producto/nuevo',
      component: NuevoProductoComponent
    },
    {
      path: 'factura',
      component: FacturaComponent
    },
    {
      path: 'lista-factura',
      component: ListaFacturasComponent
    },
    {
      path: 'principal',
      component: PrincipalComponent
    },
    {
      path: 'caja',
      component: CajaComponent
    },
    {
      path: 'facturacion',
      component: FacturacionComponent
    }

    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }
