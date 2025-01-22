import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VentaDTO } from 'src/app/dto/venta/VentaDTO';
import { FullVentaDTO } from 'src/app/dto/venta/FullVentaDTO';
import { FacturaService } from 'src/app/services/domainServices/factura.service';
import { VentaService } from 'src/app/services/domainServices/venta.service';
import { FacturaDTO } from 'src/app/dto/factura/FacturaDTO';
import { CrearFacturaDTO } from 'src/app/dto/factura/CrearFacturaDTO';
import { MenuComponent } from 'src/app/components/menu/menu.component';

@Component({
  selector: 'app-facturacion-electronica',
  templateUrl: './facturacion-electronica.component.html',
  styleUrl: './facturacion-electronica.component.css'
})
export class FacturacionElectronicaComponent {

  protected ventas: VentaDTO[];
  protected ventasFiltradas: VentaDTO[];
  public sumaTotal: number = 0;
  formVenta!: FormGroup;
  protected ventaSeleccionada: VentaDTO | null;
  protected ventaRealizada!: FullVentaDTO;
  private fb: FormBuilder = inject(FormBuilder);
  private facturaService: FacturaService = inject(FacturaService);
  private ventaService: VentaService = inject(VentaService);
  private menuComponent: MenuComponent = inject(MenuComponent);
  protected paginaActual: number = 0;
  protected totalPaginas!: number;
  protected paginas: number[] = [];

  constructor() {
    this.ventas = [];
    this.ventasFiltradas = [];
    this.ventaSeleccionada = null;
  }

  ngOnInit() {
    this.obtenerVentas(0);
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
  private obtenerVentas(page: number) {
    this.ventaService.obtenerVentas(page).subscribe(data => {
      this.totalPaginas = data.totalPages;
      this.ventas = data.content;
      this.ventasFiltradas = data.content;
      this.generarPaginas();
    })
  }

  /**
   * Método para imprimir una factura
   * en el servicio de factura
   * @param factura
   */
  protected confirmarGenerarFactura(idVenta: number | undefined) {
    if (this.ventaSeleccionada) {
      this.facturaService.imprimirFactura(this.ventaRealizada);
      console.log("id venta: " + idVenta);
      if (idVenta != undefined && idVenta != null) {
        let factura = new CrearFacturaDTO(idVenta);
        this.facturaService.crearFactura(factura);
        console.log("Factura creada");
      }
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
    this.cerrarMenu();
    this.ventaSeleccionada = venta;
    this.ventaService.obtenerVenta(venta.id).subscribe(data => {
      this.ventaRealizada = data;
    });
  }

  /**
   * Este método se encarga de cerrar el menu y asi
   * evita que se genere un bug con la ventana emergente
   */
  cerrarMenu() {
    if (!this.menuComponent.estadoMenu) {
      this.menuComponent.toggleCollapse();
    }
    console.log('el menu esta', this.menuComponent.estadoMenu);
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
    this.obtenerVentas(0);
  }

  /**
   * Este método se encarga de eliminar una venta de la base de datos
   * @param idVenta es el id de la venta a eliminar
   */
  public eliminarVenta(idVenta: number) {
    this.ventaService.preguntarEliminarVenta().then((result) => {
      if (result) {
        this.eliminarVentaSinConfirmar(idVenta);
      }
    });
  }

  private eliminarVentaSinConfirmar(idVenta: number) {
    this.ventaService.eliminarVenta(idVenta).subscribe(
      { next: () => { this.obtenerVentas(0); } }
    );
  }

  paginaAnterior() {
    if (this.paginaActual > 0) {  
      this.paginaActual--;
      this.cargarVentas();
    }
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas - 1) {  
      this.paginaActual++;
      this.cargarVentas();
    }
  }

  cargarVentas() {
    this.obtenerVentas(this.paginaActual);  
  }
  
  // Función para generar el array de páginas según el total de páginas
  generarPaginas() {
    this.paginas = Array.from({ length: this.totalPaginas }, (_, index) => index);
  }

  // Función para ir a una página específica
  irPagina(pagina: number) {
    this.paginaActual = pagina;
    this.cargarVentas();
  }
}
