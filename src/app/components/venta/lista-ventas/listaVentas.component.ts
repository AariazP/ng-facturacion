import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VentaDTO } from 'src/app/dto/venta/VentaDTO';
import { FullVentaDTO } from 'src/app/dto/venta/FullVentaDTO';
import { FacturaService } from 'src/app/services/domainServices/factura.service';
import { VentaService } from 'src/app/services/domainServices/venta.service';

@Component({
  selector: 'app-lista-ventas',
  templateUrl: './lista-ventas.component.html',
  styleUrls: ['./lista-ventas.component.css']
})
export class ListaVentasComponent {
eliminarVenta(_t41: VentaDTO) {
throw new Error('Method not implemented.');
}


  protected ventas: VentaDTO[];
  protected ventasFiltradas: VentaDTO[];
  public sumaTotal: number = 0;
  protected formVenta!: FormGroup;
  protected ventaSeleccionada: VentaDTO | null;
  protected ventaRealizada!: FullVentaDTO;

  private fb: FormBuilder = inject(FormBuilder);
  private facturaService: FacturaService = inject(FacturaService);
  private ventaService: VentaService = inject(VentaService);

  constructor() {
    this.ventas = [];
    this.ventasFiltradas = [];
    this.ventaSeleccionada = null;
  }

  ngOnInit() {
    this.obtenerVentas();
    this.buildForm();
  }

  /**
   * Método para construir el formulario
   */
  private buildForm() {
    this.formVenta = this.fb.group({
      fecha: [this.getFechaActual()]
    });
  }
  
  /**
   * Este método se encarga de obtener las ventas de la base de datos
   * a través del servicio de ventas
   */
  private obtenerVentas() {
    this.ventaService.obtenerVentas().subscribe(data => {
      this.ventas = data;
      this.ventasFiltradas = data;
    })
  }

  /**
   * Método para imprimir una factura
   * en el servicio de factura
   * @param factura
   */
  protected confirmarGenerarFactura() {
    if (this.ventaSeleccionada) {
      this.facturaService.imprimirFactura(this.ventaRealizada);
    }
  }

  /**
   * Método para cerrar la previsualización de una venta
   * y limpiar los datos de la venta seleccionada
   */
  protected cerrarPrevisualizacion() {
    this.ventaSeleccionada = null;
  }

  /**
   * Este método se encarga de mostrar la previsualización de una venta
   * con los detalles de la venta seleccionada
   * @param venta contiene los datos de la venta seleccionada
   */
  protected mostrarPrevisualizacion(venta: VentaDTO) {
    this.ventaSeleccionada = venta;
    this.ventaService.obtenerVenta(venta.id).subscribe(data => {
      this.ventaRealizada = data;
    });
  }

  /**
   * Este método se encarga de filtrar las ventas por un valor de búsqueda
   * @param evento contiene el evento de búsqueda
   */
  protected buscar(evento: Event) {
    const input = (evento.target as HTMLInputElement).value.toLowerCase();

    this.ventasFiltradas = this.ventas.filter((venta: VentaDTO) => {
        const valoresBusqueda = [
            venta.id.toString(),
            venta.fecha.toString(),
            venta.cliente.toString(),
            venta.toString(),
            venta.total.toString(),
        ];

        return valoresBusqueda.some(valor => valor.toLowerCase().includes(input));
    });
}

  /**
   * Método para filtrar las ventas por fecha
   */
  public filtrarFecha() {
    let fecha = this.formVenta.get('fecha')?.value;
    this.ventasFiltradas = this.ventas.filter((venta: VentaDTO) =>
      venta.fecha.includes(fecha)
    );
  }

  /**
   * Establece la fecha actual en el formato 'YYYY/MM/DD'
   * @returns la fecha actual en formato 'YYYY/MM/DD' 
   */
  private getFechaActual(): string {
    const today = new Date();
    const formattedDate1 = `${today.getFullYear()}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}`;
    return formattedDate1;
  }

  /**
   * Método para obtener los datos de la base de datos
   */
  protected reset() {
    this.obtenerVentas();
  }

}
