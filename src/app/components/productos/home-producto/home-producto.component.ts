import { Component, inject } from '@angular/core';
import { ProductoDTO } from 'src/app/dto/producto/ProductoDTO';
import { ProductoService } from 'src/app/services/producto.service';
import { ProductoAlertService } from 'src/app/utils/product-alert/productoAlert.service';
@Component({
  selector: 'app-home-producto',
  templateUrl: './home-producto.component.html',
  styleUrls: ['./home-producto.component.css']
})
export class HomeProductoComponent {


  private productos: ProductoDTO[];
  protected productosEditar!: ProductoDTO;
  protected filtroProductos: ProductoDTO[];
  protected modoOculto: boolean = true;
  protected totalProductos: number = 0;

  private productoService: ProductoService = inject(ProductoService);
  private productoAlert: ProductoAlertService = inject(ProductoAlertService);

  constructor() {
    this.productos = [];
    this.filtroProductos = [];
  }

  ngOnInit() {
    this.obtenerProductos();
    this.updateProductoCount();
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
  private obtenerProductos() {
    this.productoService.getProductos().subscribe(data => {
      this.productos = data;
      this.filtroProductos = data;
      this.updateProductoCount();
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
        this.obtenerProductos();
      } catch (error) {}
    }
  }

  /**
   * Este método se encarga de buscar un producto por su código o nombre
   * @param texto 
   */
  buscar(evento: Event): void {
    const input = (evento.target as HTMLInputElement).value.toLowerCase();
  
    this.filtroProductos = this.productos.filter((producto: ProductoDTO) =>
      this.coincideConBusqueda(producto, input)
    );
  
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
    this.obtenerProductos();
  }

}
