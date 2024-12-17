import { inject, Injectable } from "@angular/core";
import { AlertService } from "../utils/alert.service";
import { CrearVentaDTO } from "../dto/venta/CrearVentaDTO";
import { ClienteService } from "./cliente.service";
import { DetalleVentaDTO } from "../dto/detalleVenta/DetalleVentaDTO";
import { map, Observable, Subject } from "rxjs";
import { ClienteDTO } from "../dto/cliente/ClienteDTO";
import { HttpVentaService } from "../http-services/httpVenta.service";

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private httpFacturaService: HttpVentaService = inject(HttpVentaService);
  private alert: AlertService = inject(AlertService);
  private clientService: ClienteService = inject(ClienteService);


  /**
   * Este metodo se encarga de crear una venta y guardarla en la base de datos
   * @param venta es el DTO de la venta que se va a guardar
   * @param total es el total de la venta
   * @returns un observable de tipo void
   */

  public crearVenta(venta: CrearVentaDTO, total: number): Observable<boolean> {
    const subject = new Subject<boolean>();
    this.alert.simpleInputAlert().then((result) => {
      let dinero = 0;
      console.log("El dinero es valido: "+this.validarDinero(result, total, dinero));
      if (!this.validarDinero(result, total, dinero)) return subject.next(false);
      if (!this.verificarExistenciaCliente(venta.cliente)) return subject.next(false);
      this.guardarVenta(venta, total, dinero);
    });

    return subject.asObservable();
  }

  /**
   * Este metodo se encarga de validar el dinero ingresado por el usuario
   * Valida que el valor ingresado sea un número y que sea mayor o igual al total de la factura
   * @param result es la respuesta del input alert
   * @param total  es el total de la factura
   * @param dinero es el dinero ingresado por el usuario
   * @returns un booleano que indica si el dinero es valido
   */
  private validarDinero(result: number, total: number, dinero: number): boolean {

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
    console.log("dinero: "+dinero);
    console.log("total: "+total);
    if (dinero < total) {
      this.alert.simpleErrorAlert('El dinero ingresado es menor al total de la factura');
      return !isValid;
    }

    return isValid;

  }

  /**
   * Este metodo se encarga de guardar la venta en la base de datos
   * @param venta DTO de la venta 
   * @param total  total de la venta
   * @param dinero dinero ingresado por el usuario
   */
  private guardarVenta(venta: CrearVentaDTO, total: number, dinero: number) {

    this.httpFacturaService.guardarFactura(venta).subscribe({

      next: () => {
        this.mostrarCambio(dinero, total);
        this.alert.simpleSuccessAlert('Factura guardada correctamente');
        this.imprimirFactura();
      },

      error: (error) => { this.alert.simpleErrorAlert(error.error.mensaje); }
    });
  }

  /**
   * Este metodo se encarga de mostrar el cambio al usuario 
   * @param dinero Cantidad de dinero dada por el usuario
   * @param total Total de la factura
   */
  private mostrarCambio(dinero: number, total: number) {
    setTimeout(() => {
      this.alert.simpleSuccessAlert('El cambio es: ' + (dinero - total));
    }, 300);
  }

  /**
   * Este metodo se encarga de verificar si un cliente existe en la base de datos
   * @param cedula  cedula del cliente
   * @returns 
   */
  public verificarExistenciaCliente(cedula: string): boolean {
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

  /**
   * Este metodo se encarga de obtener un cliente de la base de datos
   * @param cedula cedula del cliente
   * @returns un observable de tipo ClienteDTO o null
   */
  public obtenerCliente(cedula: string): Observable<ClienteDTO | null> {
    return this.clientService.obtenerCliente(cedula).pipe(
      map(response => {return response;})
    );
  }

  /**
   * Este metodo se encarga de agregar los productos que se agregaron al carrito a la factura
   * @param factura DTO de la factura que se va a guardar
   * @param listProductos lista de productos que se agregaron al carrito
   * @returns un booleano que indica si se agregaron los productos correctamente
   */
  public agregarProductosVenta(factura: CrearVentaDTO, listProductos: any[]): boolean {
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

  generarIdVenta(): Observable<number> {
    return this.httpFacturaService.generaIdVenta();
  }

  imprimirFactura() {
    console.log('Factura impresa');
  }
}