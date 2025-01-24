import { Component, inject } from '@angular/core';
import { ProductoDTO } from 'src/app/dto/producto/ProductoDTO';
import { ProductoService } from 'src/app/services/domainServices/producto.service';
import { ProductoAlertService } from 'src/app/utils/product-alert/productoAlert.service';
@Component({
  selector: 'app-home-producto',
  templateUrl: './home-producto.component.html',
  styleUrls: ['./home-producto.component.css']
})
export class HomeProductoComponent {


  private productos: ProductoDTO[];
  private productosTodos!: ProductoDTO[];
  protected productosEditar!: ProductoDTO;
  protected filtroProductos: ProductoDTO[];
  protected modoOculto: boolean = true;
  protected totalProductos: number = 0;

  private productoService: ProductoService = inject(ProductoService);
  private productoAlert: ProductoAlertService = inject(ProductoAlertService);
  protected paginaActual: number = 0;
  protected totalPaginas!: number;
  protected paginas: number[] = [];

  constructor() {
    this.productos = [];
    this.filtroProductos = [];
  }

  ngOnInit() {
    this.listarProductos();
    this.obtenerProductos(0);
    this.obtenerProductosTodos();
    this.updateProductoCount();
  }

  /**
   * Este metodo se encarga de guardar en la variable productosTodos
   * todos los productos que se encuentran en LocalStorage con la variable productos
   */
  obtenerProductosTodos() {
    this.productosTodos = JSON.parse(localStorage.getItem('productos') || '[]');
  }


  /**
   * Este método se encarga de actualizar el contador de productos
   */
  private updateProductoCount() {
    this.totalProductos = this.filtroProductos.length;
  }

  /**
   * Este método se encarga de obtener los productos de la base de datos
   */
  private obtenerProductos(page: number) {
    this.productoService.getProductos(page).subscribe(data => {
      this.productos = data.content;
      this.filtroProductos = data.content.sort((a: any, b: any) => a.cantidad - b.cantidad);
      this.totalPaginas = data.totalPages;
      this.updateProductoCount();
      this.generarPaginas();
    });
  }
  /**
   * Este método se encarga de eliminar un producto de la base de datos
   * @param id es el id del producto a eliminar
   */
  protected async eliminarProductoCodigo(codigo: string) {
    const result = await this.productoAlert.eliminarProducto();
    if (result) {
      try {
        await this.productoService.eliminarProductoCodigo(codigo);
        this.obtenerProductos(0);
      } catch (error) { }
    }
  }

  /**
   * Este método se encarga de listar todos los productos disponibles en la base de datos,
   * haciendo solicitudes hasta que no se reciban más productos.
   */
  protected listarProductos(): void {
    let page = 0;
    this.productos = [];
  
    const obtenerProductosRecursivamente = (paginaActual: number): void => {
      this.productoService.getProductos(paginaActual).subscribe({
        next: (data) => {
          // Si hay productos en la página actual, se agregan a la lista de productos
          if (data.content.length > 0) {
            this.productos = [...this.productos, ...data.content];
  
            // Guardar los productos actualizados en localStorage
            localStorage.setItem('productos', JSON.stringify(this.productos));
  
            // Llama a la siguiente página
            obtenerProductosRecursivamente(paginaActual + 1);
          } else {
            console.log('Todos los productos han sido cargados:', this.productos.length);
          }
        },
        error: (err) => {
          console.error('Error al listar productos:', err);
        }
      });
    };
  
    // Comienza a obtener productos desde la primera página
    obtenerProductosRecursivamente(page);
  }

  /**
   * Este método se encarga de buscar un producto por su código o nombre
   * @param texto 
   */
  buscar(evento: Event): void {
    const input = (evento.target as HTMLInputElement).value.toLowerCase();

    this.filtroProductos = this.productosTodos.filter((producto: ProductoDTO) =>
      this.coincideConBusqueda(producto, input)
    ).sort((a: any, b: any) => a.cantidad - b.cantidad);

    this.updateProductoCount();
  }
  /**
   * Este método se encarga de verificar si un producto coincide con la búsqueda
   * @param producto  producto a verificar
   * @param texto  texto de búsqueda
   * @returns  un booleano que indica si el producto coincide con la búsqueda
   */
  private coincideConBusqueda(producto: ProductoDTO, texto: string): boolean {
    const { codigo, nombre } = producto;
    return (
      codigo.toString().toLowerCase().includes(texto) ||
      nombre.toLowerCase().includes(texto)
    );
  }

  /**
   * Este método se encarga de cambiar el modo de edición de un producto
   * y mostrar el formulario de edición a través de un modal
   * @param producto es el producto a editar
   */
  protected toggleModoEdicion(producto: ProductoDTO) {
    this.productosEditar = producto;
    this.editarModoOcuto()
  }

  /**
   * Este método se encarga de cambiar el modo de edición de un producto
   * @returns void
   */
  protected editarModoOcuto() {
    this.modoOculto = !this.modoOculto;
    this.obtenerProductos(0);
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
    this.obtenerProductos(this.paginaActual);
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
