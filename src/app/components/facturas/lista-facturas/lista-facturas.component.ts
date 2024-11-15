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
  facturaSeleccionada: any = null;


  constructor(private facturasService: FacturasService, private fb: FormBuilder) {

    this.formFacturas = this.fb.group({
      fecha: ['']
    });
  }
  ngOnInit() {
   this.getData();
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
    doc.text('Número de Factura: ' + factura.idFactura, 10, 20);
    doc.text('Cédula Cliente: ' + factura.cedulaCliente, 10, 30);
    doc.text('Fecha y Hora: ' + factura.fechaHora, 10, 40);
    doc.text('Total: ' + factura.total + ' USD', 10, 50);

    // Descargar el PDF
    doc.save(`Factura_${factura.idFactura}.pdf`);
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
      factura.fechaHora.includes(fecha)
    );
  }
    
  reset() {
    this.getData();
  }

}
