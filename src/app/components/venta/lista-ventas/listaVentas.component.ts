import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpVentaService } from 'src/app/http-services/httpVenta.service';
import { FacturaService } from 'src/app/services/venta.service';

@Component({
  selector: 'app-lista-ventas',
  templateUrl: './lista-ventas.component.html',
  styleUrls: ['./lista-ventas.component.css']
})
export class ListaVentasComponent {


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
  private facturaService:FacturaService = inject(FacturaService);


  constructor(private httpVentaService: HttpVentaService, private fb: FormBuilder) {

    this.formFacturas = this.fb.group({
      fecha: [this.getFechaActual()]
    });

    this.formFechaActual = this.fb.group({
      fecha: [this.getFechaActual()]
    });

  }
  ngOnInit() {
   this.getData();
  }

  getData(){
    this.facturaService.obtenerVentas().subscribe(data => {
      this.facturas = data;
      this.facturasFiltradas = data;
    })
  }

  generarFactura(factura: any) {
    console.log("Generando factura...");
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
    this.httpVentaService.obtenerDetalleVenta(factura.id).subscribe(data => {
      this.carritoComprado = data;
    })
  }

  calcularSumaTotal(){
    this.sumaTotal = this.facturas.reduce((sum: number, factura: any) => sum + factura.total, 0);
  }

  eliminarPorId(id: number) {
    console.log(id)
    this.httpVentaService.eliminarPorId(id).subscribe(
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
