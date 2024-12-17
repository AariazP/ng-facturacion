import { Component, inject } from '@angular/core';
import { ProductoDTO } from 'src/app/dto/producto/ProductoDTO';
import { HttpProductoService } from 'src/app/http-services/httpProductos.service';
import { ProductoService } from 'src/app/services/producto.service';
import { AlertService } from 'src/app/utils/alert.service';
@Component({
  selector: 'app-home-producto',
  templateUrl: './home-producto.component.html',
  styleUrls: ['./home-producto.component.css']
})
export class HomeProductoComponent {

  
  productos: ProductoDTO[] ; 
  productosEditar: any;
  filtroProductos: any [] = [];
  modoOculto: boolean = true;
  totalProductos: number = 0;

  private productoService: ProductoService = inject(ProductoService);
  
  constructor(private alert: AlertService) {
    this.productos = [];
  }
  ngOnInit() {
   this.getData();
   this.updateProductoCount();
  }

  updateProductoCount() {
    this.totalProductos = this.filtroProductos.length;
  }
  
  getData(){
    this.productoService.getProductos().subscribe(data => {
      this.productos = data;
      this.filtroProductos= data;
      this.updateProductoCount(); 
    });
  }
  
  eliminarPorId(id: number) {

    this.productoService.eliminarPorId(id);
    
  }
  
  buscar(texto: Event) {
    const input = texto.target as HTMLInputElement;
    this.filtroProductos = this.productos.filter( (producto: any) =>
      producto.codigo.toString().toLowerCase().includes(input.value.toLowerCase()) ||
      producto.nombre.toLowerCase().includes(input.value.toLowerCase()) 
    );
    this.updateProductoCount(); 

  }

  toggleModoEdicion(persona: any) {
    this.productosEditar = persona;
    this.editarModoOcuto()
  }

  editarModoOcuto(){
    this.modoOculto = !this.modoOculto;
    this.getData();
  }





}
