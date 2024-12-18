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


  productos: ProductoDTO[];
  productosEditar: any;
  filtroProductos: ProductoDTO[];
  modoOculto: boolean = true;
  totalProductos: number = 0;

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

  buscar(texto: Event) {
    const input = texto.target as HTMLInputElement;
    this.filtroProductos = this.productos.filter((producto: any) =>
      producto.codigo.toString().toLowerCase().includes(input.value.toLowerCase()) ||
      producto.nombre.toLowerCase().includes(input.value.toLowerCase())
    );
    this.updateProductoCount();

  }

  toggleModoEdicion(persona: any) {
    this.productosEditar = persona;
    this.editarModoOcuto()
  }

  editarModoOcuto() {
    this.modoOculto = !this.modoOculto;
    this.obtenerProductos();
  }

}
