import { inject, Injectable } from "@angular/core";
import { AlertService } from "../utils/alert.service";
import { HttpFacturasService } from "../http-services/httpFacturas.service";
import { CrearVentaDTO } from "../dto/venta/CrearVentaDTO";
import { ClienteService } from "./cliente.service";
import { DetalleVentaDTO } from "../dto/detalleVenta/DetalleVentaDTO";
import jsPDF from "jspdf";

@Injectable({
    providedIn: 'root'
  })
export class FacturaService {
    

    private alertService: AlertService = inject(AlertService);
    private httpFacturaService: HttpFacturasService = inject(HttpFacturasService);
    private alert : AlertService = inject(AlertService);
    private clientService: ClienteService = inject(ClienteService);

    crearFactura(factura: any, total:number) {

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
            this.verificarExistenciaCliente(factura.cliente);
        
          
          this.guardarFactura(factura, total, dinero);
            
          });


    }

    guardarFactura(factura: any, total:number, dinero:number) {
        this.httpFacturaService.guardarFactura(factura).subscribe(
            (resp: any) => {
              setTimeout(() => {
                this.alert.simpleSuccessAlert('El cambio es: ' + (dinero-total));
              }, 300);
              this.alert.simpleSuccessAlert('Factura guardada correctamente');
                  // Llamar al método imprimirFactura() después de guardar la factura
            this.imprimirFactura();
            },
            error => {
              this.alert.simpleErrorAlert(error.error.mensaje);
            }
          );
    }

    verificarExistenciaCliente(cedula: any) {
        this.clientService.verificarExistencia(cedula).subscribe(
            response => {
              if(!response){
                this.alert.simpleErrorAlert('El cliente con esa cedula no se ha encontrado');
                return;
              }
        });
    }
    
    agregarProductosAFactura(factura: CrearVentaDTO, listProductos: any[]) {
        if(listProductos.length == 0){
            this.alert.simpleErrorAlert('No se ha agregado ningun producto a la factura');
            return;
          }
      
          listProductos.map(producto => {
            let detalleFactura =  new DetalleVentaDTO();
            detalleFactura.cantidad = producto.cantidadProducto;
            detalleFactura.codProducto = producto.codProducto
            factura.agregarDetalle(detalleFactura);
          });
    }

    generarIdFactura(){
        return this.httpFacturaService.generaIdFactura();
    }

    imprimirFactura() {
        const doc = new jsPDF();
      
        // Establecer el tamaño de fuente
        doc.setFontSize(12);
      
        // Añadir contenido de la factura, como la información del cliente
        doc.text('Factura de Venta', 10, 10);
        doc.text('Fecha: ' + new Date().toLocaleDateString(), 10, 40);
      
        // Espacio entre la información del cliente y los productos
        let startY = 50; // Posición Y inicial donde comenzarán los productos
      
        // Recorrer la lista de productos y agregarlos al PDF
        this.listProductos.forEach((producto: any, index: number) => {
          const productoY = startY + (index * 10); // Aumenta la posición Y para cada producto
      
          // Agregar el nombre, cantidad y precio de cada producto al PDF
          doc.text(`${producto.nombreProducto} - Cantidad: ${producto.cantidad} - Precio: ${producto.precio.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`, 10, productoY);
        });
      
        // Descargar el PDF con un nombre dinámico basado en el cliente
        doc.save(`Factura.pdf`);
      }
}