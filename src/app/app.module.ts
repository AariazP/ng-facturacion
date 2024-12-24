import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClienteComponent } from './page/cliente/cliente.component';
import { ProductoComponent } from './page/producto/producto.component';
import { FacturaComponent } from './page/factura/factura.component';
import { MenuComponent } from './components/menu/menu.component';
import { Cod404Component } from './components/cod404/cod404.component';
import { NuevoComponent } from './components/clientes/nuevo/nuevo.component';
import { HomeClienteComponent } from './components/clientes/home-cliente/home-cliente.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeProductoComponent } from './components/productos/home-producto/home-producto.component';
import { NuevoProductoComponent } from './components/productos/nuevo-producto/nuevo-producto.component';
import { EditarClienteComponent } from './components/clientes/editar-cliente/editar-cliente.component';
import { EditarProductoComponent } from './components/productos/editar-producto/editar-producto.component';
import { LoginComponent } from './page/login/login.component';
import { CardComponent } from './components/card/card.component';
import { PrincipalComponent } from './page/principal/principal.component';
import { VentaComponent } from './components/venta/venta/venta.component';
import { ListaVentasComponent } from './components/venta/lista-ventas/listaVentas.component';
import { ProductoAlertService } from './utils/product-alert/productoAlert.service';
import { CajaComponent } from './page/caja/caja.component';
import { ConfiguracionComponent } from './page/configuracion/configuracion.component';

@NgModule({
  declarations: [
    AppComponent,
    ClienteComponent,
    ProductoComponent,
    FacturaComponent,
    MenuComponent,
    CajaComponent,
    HomeClienteComponent,
    Cod404Component,
    NuevoComponent,
    HomeProductoComponent,
    NuevoProductoComponent,
    EditarClienteComponent,
    EditarProductoComponent,
    LoginComponent,
    CardComponent,
    PrincipalComponent,
    VentaComponent,
    ConfiguracionComponent,
    ListaVentasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    // PageModule
  ],
  providers: [ListaVentasComponent, ProductoAlertService],
  exports:[CardComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }