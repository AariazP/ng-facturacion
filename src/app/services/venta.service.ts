import { inject, Injectable } from "@angular/core";
import { AlertService } from "../utils/alert.service";
import { CrearVentaDTO } from "../dto/venta/CrearVentaDTO";
import { ClienteService } from "./cliente.service";
import { DetalleVentaDTO } from "../dto/detalleVenta/DetalleVentaDTO";
import { map, Observable } from "rxjs";
import { ClienteDTO } from "../dto/cliente/ClienteDTO";
import { HttpVentaService } from "../http-services/httpVenta.service";

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private httpFacturaService: HttpVentaService = inject(HttpVentaService);
  private alert: AlertService = inject(AlertService);
  private clientService: ClienteService = inject(ClienteService);

  crearVenta(venta: CrearVentaDTO, total: number) {

    this.alert.simpleInputAlert().then((result) => {
      let dinero = 0;
      if (!this.validarDinero(result, total, dinero)) return;
      if (!this.verificarExistenciaCliente(venta.cliente)) return;
      this.guardarVenta(venta, total, dinero);
    });

    return 
  }

  validarDinero(result: number, total: number, dinero: number) {

    let isValid = true;

    if (result == null || result == undefined) {
      this.alert.simpleErrorAlert('No se ha ingresado un valor');
      return !isValid;
    }

    if (isNaN(Number(result))) {
      this.alert.simpleErrorAlert('El valor ingresado no es un número');
      return !isValid;
    }

    if (result) dinero = Number(result);

    if (dinero < total) {
      this.alert.simpleErrorAlert('El dinero ingresado es menor al total de la factura');
      return !isValid;
    }

    return isValid;

  }

  guardarVenta(venta: CrearVentaDTO, total: number, dinero: number) {

    this.httpFacturaService.guardarFactura(venta).subscribe({

      next: () => {
        this.mostrarCambio(dinero, total);
        this.alert.simpleSuccessAlert('Factura guardada correctamente');
        this.imprimirFactura();
      },

      error: (error) => { this.alert.simpleErrorAlert(error.error.mensaje); }
    });
  }

  mostrarCambio(dinero: number, total: number) {
    setTimeout(() => {
      this.alert.simpleSuccessAlert('El cambio es: ' + (dinero - total));
    }, 300);
  }

  verificarExistenciaCliente(cedula: string) {
    let existe = true;
    this.clientService.verificarExistencia(cedula).subscribe(
      response => {
        if (!response) {
          this.alert.simpleErrorAlert('El cliente con esa cedula no se ha encontrado');
          existe = false;
        }
      });
    return existe;
  }

  obtenerCliente(cedula: string): Observable<ClienteDTO | null> {
    return this.clientService.obtenerCliente(cedula).pipe(
      map(response => {return response;})
    );
  }


  agregarProductosVenta(factura: CrearVentaDTO, listProductos: any[]) {
    if (listProductos.length == 0) {
      this.alert.simpleErrorAlert('No se ha agregado ningun producto a la factura');
      return false;
    }
    listProductos.map(producto => {
      let detalleFactura = new DetalleVentaDTO();
      detalleFactura.cantidad = producto.cantidadProducto;
      detalleFactura.codigoProducto = producto.codigoProducto
      factura.agregarDetalle(detalleFactura);
    });

    return true;
  }

  generarIdVenta() {
    return this.httpFacturaService.generaIdVenta();
  }

  imprimirFactura() {

  }
}