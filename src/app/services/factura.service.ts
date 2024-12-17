import { inject, Injectable } from "@angular/core";
import { AlertService } from "../utils/alert.service";
import { HttpVentaService } from "../http-services/httpVenta.service";
import { CrearVentaDTO } from "../dto/venta/CrearVentaDTO";
import { ClienteService } from "./cliente.service";
import { DetalleVentaDTO } from "../dto/detalleVenta/DetalleVentaDTO";

@Injectable({
    providedIn: 'root'
  })
export class FacturaService {

    private httpVentaService: HttpVentaService = inject(HttpVentaService);
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
        this.httpVentaService.guardarFactura(factura).subscribe(
            (resp: any) => {
              setTimeout(() => {
                this.alert.simpleSuccessAlert('El cambio es: ' + (dinero-total));
              }, 300);
              this.alert.simpleSuccessAlert('Factura guardada correctamente');
                  // Llamar al método imprimirFactura() después de guardar la factura
            //this.imprimirFactura(factura);
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
            detalleFactura.codigoProducto = producto.codigoProducto
            factura.agregarDetalle(detalleFactura);
          });
    }

    generarIdFactura(){
        return this.httpVentaService.generaIdVenta();
    }

    imprimirFactura(venta: any) {
      // Calcula el IVA y la base
      const iva = venta.total * 0.19;
      const base = venta.total - iva;
      //Obtener todos los datos de la venta para generar la factura
      const data = {
        fecha: new Date().toLocaleDateString(),
        fechaVenta: venta.fecha,
        cliente: venta.nombreCliente,
        cc: venta.cedulaCliente,
        direccion: venta.direccionCliente,
        correo: venta.correo,
        productos: venta.detalleVentaList,
        total: venta.total,
        cambio: 0,
        base: base,
        iva: iva,
        cufe: 'b015063ded3dd7d0aa9c5ea54bc088c800b6c25de46aaca068a2ce2930a27a166c435ae9c978b0f5c88bec073befece7'
      };
      //Enviar la data para generar la factura
      this.generateInvoice(data);
    }

    async generateInvoice(data: any) {
        try {
     
          // Cargar el archivo HTML desde la carpeta de assets
          const response = await fetch('assets/factura.html');
          let facturaHTML = await response.text();
      
          // Función para dar formato al dinero
          const formatoDinero = (value: number) => {
            return new Intl.NumberFormat('es-CO', {
              minimumFractionDigits: 0, // Sin decimales
              maximumFractionDigits: 0, // Sin decimales
              useGrouping: true         // Agrupación con puntos
            }).format(value);
          };
    
          // Reemplazar los marcadores de posición con los datos reales
          facturaHTML = facturaHTML
            .replace('{{fechaVenta}}', data.fechaVenta)
            .replace('{{fecha}}', data.fecha)
            .replace('{{cliente}}', data.cliente)
            .replace('{{cc}}', data.cc)
            .replace('{{correo}}', data.correo)
            .replace('{{direccion}}', data.direccion)
            .replace('{{base}}', formatoDinero(data.base))  
            .replace('{{iva}}', formatoDinero(data.iva))
            .replace('{{efectivo}}', formatoDinero(data.total))
            .replace('{{total}}', formatoDinero(data.total)) 
            .replace('{{cambio}}', formatoDinero(data.cambio)) 
            .replace('{{cufe}}', data.cufe)
            .replace('{{productos}}', data.productos
              .map((producto: any) => `
                <tr>
                  <td>${producto.producto}</td>
                  <td>${producto.cantidad}</td>
                  <td>${formatoDinero(producto.precio)}</td> <!-- Precio formateado -->
                </tr>
              `).join('')
            );
      
          // Abrir el HTML generado en una ventana nueva
          const printWindow = window.open('', '_blank');
          if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(facturaHTML);
            printWindow.document.close();
            printWindow.print();
          }
        } catch (error) {
          console.error('Error al generar la factura:', error);
        }
      }
    
  }