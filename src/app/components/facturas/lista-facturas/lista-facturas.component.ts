import { Component } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { ClientesService } from 'src/app/service/clientes.service';
import { FacturasService } from 'src/app/service/facturas.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-lista-facturas',
  templateUrl: './lista-facturas.component.html',
  styleUrls: ['./lista-facturas.component.css']
})
export class ListaFacturasComponent {


  facturas: any ;
  personaEditar: any;
  facturasFiltradas!: any;
  modoOculto: boolean = true;
  sumaTotal: number = 0;
  formFacturas: FormGroup;
  formFechaActual: FormGroup;
  facturaSeleccionada: any = null;
  idFacturaSeleccionada: any;
  carritoComprado: any;


  constructor(private facturasService: FacturasService, private fb: FormBuilder) {

    this.formFacturas = this.fb.group({
      fecha: [this.getFechaActual()]
    });

    this.formFechaActual = this.fb.group({
      fecha: [this.getFechaActual()]
    });

  }
  ngOnInit() {
   this.getData();
   //this.establecerFecha(this.getFechaActual());
  }

  getData(){
    this.facturasService.getData().subscribe(data => {
      this.facturas = data;
      this.facturasFiltradas = data;
    })
  }

  generarFactura(factura: any) {
    const doc = new jsPDF();

    // Añadir contenido al PDF
    doc.setFontSize(12);
    doc.text('Factura de Venta', 10, 10);
    doc.text('Número de Factura: ' + factura.id, 10, 20);
    doc.text('Cédula Cliente: ' + factura.cliente, 10, 30);
    doc.text('Fecha y Hora: ' + factura.fecha, 10, 40);
    doc.text('Total: ' + factura.total + ' USD', 10, 50);

    // Generar el PDF como Blob
    const pdfBlob = doc.output('blob');

    // Crear un objeto URL para el Blob
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Abrir el PDF en una nueva ventana y mostrar la pantalla de impresión
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(
            `<iframe width="100%" height="100%" src="${pdfUrl}" frameborder="0"></iframe>`
        );
        printWindow.document.close(); // Cierra el flujo del documento para garantizar que se cargue el contenido
        printWindow.focus(); // Asegurarse de que la ventana se enfoque
        printWindow.print(); // Llama al diálogo de impresión
    }
}

  confirmarGenerarFactura() {
    if (this.facturaSeleccionada) {
      this.generarFactura(this.facturaSeleccionada);
    }
  }
  
  // Método para cerrar la previsualización
  cerrarPrevisualizacion() {
    this.facturaSeleccionada = null;
  }

  // Método para mostrar la previsualización de una factura
  mostrarPrevisualizacion(factura: any) {
    this.facturaSeleccionada = factura;
    this.facturasService.obtenerDetalleVenta(factura.id).subscribe(data => {
      this.carritoComprado = data;
    })
  }

  calcularSumaTotal(){
    this.sumaTotal = this.facturas.reduce((sum: number, factura: any) => sum + factura.total, 0);
  }

  eliminarPorId(id: number) {
    console.log(id)
    this.facturasService.eliminarPorId(id).subscribe(
      (response) => {
      console.log('Persona eliminada correctamente');
      this.getData();
    }, error => {
      console.error('Error al eliminar persona:', error);
    });
  }
  buscar(texto: Event) {
    const input = texto.target as HTMLInputElement;
    console.log(this.facturasFiltradas)
    this.facturasFiltradas = this.facturas.filter( (factura: any) =>
      factura.idFcatura.toString().includes(input.value.toLowerCase()) ||
      factura.numeroFactura.toString().includes(input.value.toLowerCase()) ||
      factura.rucCliente.toString().includes(input.value.toLowerCase()) ||
     factura.subtotal.toString().includes(input.value.toLowerCase()) ||
     factura.igv.toString().includes(input.value.toLowerCase()) ||
     factura.total.toString().includes(input.value.toLowerCase())
    );
  }

  filtrarFecha() {
    let fecha = this.formFacturas.get('fecha')?.value;
    this.facturasFiltradas = this.facturas.filter( (factura: any) =>
      factura.fecha.includes(fecha)
    );
  }

  establecerFecha(fecha : string) {
    console.log(fecha);
    console.log(this.facturas);
    this.facturasFiltradas = this.facturas.filter( (factura: any) =>{
      factura.fecha.includes(fecha)
    }
    );
  }

  getFechaActual(): string {
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    const formattedDate1 = `${today.getFullYear()}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}`;
    return formattedDate1;
  }
    
  reset() {
    this.getData();
  }

}
