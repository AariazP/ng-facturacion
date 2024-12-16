import { inject, Injectable } from "@angular/core";
import { AlertService } from "../utils/alert.service";
import { HttpFacturasService } from "../http-services/httpFacturas.service";
import { CrearVentaDTO } from "../dto/venta/CrearVentaDTO";
import { ClienteService } from "./cliente.service";
import { DetalleVentaDTO } from "../dto/detalleVenta/DetalleVentaDTO";
import jsPDF from "jspdf";
import { map, Observable } from "rxjs";
import { ClienteDTO } from "../dto/cliente/ClienteDTO";
import { FacturaDTO } from "../dto/factura/FacturaDTO";

@Injectable({
    providedIn: 'root'
  })
export class FacturaService {
    
    

    private alertService: AlertService = inject(AlertService);
    private httpFacturaService: HttpFacturasService = inject(HttpFacturasService);
    private alert : AlertService = inject(AlertService);
    private clientService: ClienteService = inject(ClienteService);

    crearVenta(venta: CrearVentaDTO, total:number) {

        this.alert.simpleInputAlert().then((result) => {
            let dinero = 0;
            
            if(result == null || result == undefined){
              this.alert.simpleErrorAlert('No se ha ingresado un valor');
              return;
            }
      
      
            if (isNaN(Number(result))) {
              this.alert.simpleErrorAlert('El valor ingresado no es un número');
              return;
            }
            console.log('result' + result);
            if (result) {
              dinero = Number(result);
            }
            if (dinero < total) {
              this.alert.simpleErrorAlert('El dinero ingresado es menor al total de la factura');
              return;
            }
      
            //Hay que asegurar que el metodo se rompa si no se encuentra el cliente
            if(!this.verificarExistenciaCliente(venta.cliente)) return;
        
            this.guardarVenta(venta, total, dinero);
            
          });
    }

    guardarVenta(venta: CrearVentaDTO, total:number, dinero:number) {
      console.log('factura' + venta);
        this.httpFacturaService.guardarFactura(venta).subscribe(
            (resp: any) => {
              setTimeout(() => {
                this.alert.simpleSuccessAlert('El cambio es: ' + (dinero-total));
              }, 300);
              this.alert.simpleSuccessAlert('Factura guardada correctamente');
                  // Llamar al método imprimirFactura() después de guardar la factura
            this.imprimirFactura();
            },
            error => {
              console.log(error);
              this.alert.simpleErrorAlert(error);
            }
          );
    }

    verificarExistenciaCliente(cedula: string) {
      let existe = true;
        this.clientService.verificarExistencia(cedula).subscribe(
            response => {
              if(!response){
                this.alert.simpleErrorAlert('El cliente con esa cedula no se ha encontrado');
                existe = false;
              }
        });
        return existe;
    }

    obtenerCliente(cedula: string): Observable<ClienteDTO | null> {
      return this.clientService.obtenerCliente(cedula).pipe(
        map(response => {
          // Aquí puedes transformar o procesar la respuesta si es necesario
          return response; // Si la respuesta ya es del tipo Cliente, simplemente la devuelves
        })
      );
    }

    
    agregarProductosVenta(factura: CrearVentaDTO, listProductos: any[]) {
        if(listProductos.length == 0){
            this.alert.simpleErrorAlert('No se ha agregado ningun producto a la factura');
            return false;
          }
          listProductos.map(producto => {
            let detalleFactura =  new DetalleVentaDTO();
            detalleFactura.cantidad = producto.cantidadProducto;
            detalleFactura.codigoProducto = producto.codigoProducto
            factura.agregarDetalle(detalleFactura);
          });
          console.log("Se agregan los productos a la factura")
          console.log(factura);
          return true;
    }

    generarIdVenta(){
        return this.httpFacturaService.generaIdVenta();
    }

    imprimirFactura() {
        
      }
}