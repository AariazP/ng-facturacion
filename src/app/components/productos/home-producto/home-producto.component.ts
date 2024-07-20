import { Component } from '@angular/core';
import { ProductoService } from 'src/app/service/productos.service';
@Component({
  selector: 'app-home-producto',
  templateUrl: './home-producto.component.html',
  styleUrls: ['./home-producto.component.css']
})
export class HomeProductoComponent {

  
  productos: any ; 
  productosEditar: any;
  filtroProductos: any [] = [];
  modoOculto: boolean = true;
  totalProductos: number = 0;
  constructor(private productoService: ProductoService) {
  }
  ngOnInit() {
   this.getData();
   this.updateProductoCount();
  }

  updateProductoCount() {
    this.totalProductos = this.filtroProductos.length;
  }
  
  getData(){
    this.productoService.getData().subscribe(data => {
      this.productos = data;
      this.filtroProductos = data;
      this.updateProductoCount(); // Actualiza el conteo cuando se obtienen los datos
      
    })
  }
  
  eliminarPorId(id: number) {
    console.log(id)
    this.productoService.eliminarPorId(id).subscribe(
      (response) => {
      console.log('Producto eliminada correctamente');
      this.getData();
    }, error => {
      console.error('Error al eliminar producto:', error);
    });
  }
  buscar(texto: Event) {
    const input = texto.target as HTMLInputElement;
    console.log(this.filtroProductos);
    this.filtroProductos = this.productos.filter( (producto: any) =>
      producto.idProducto.toString().includes(input.value.toLowerCase()) ||
      producto.codigo.toString().toLowerCase().includes(input.value.toLowerCase()) ||
      producto.nombre.toLowerCase().includes(input.value.toLowerCase()) ||
      producto.precio.toString().includes(input.value.toLowerCase()) ||
      producto.stock.toString().includes(input.value.toLowerCase()) ||
      producto.activo.toString().includes(input.value.toLowerCase())
    );
    console.log(this.filtroProductos)
    this.updateProductoCount(); // Actualiza el conteo cuando se obtienen los datos

  }

  toggleModoEdicion(persona: any) {
    this.productosEditar = persona;
    this.editarModoOcuto()
    console.log("algoooo*", this.productosEditar);
  }

  editarModoOcuto(){
    this.modoOculto = !this.modoOculto;
    this.getData();
  }


}
