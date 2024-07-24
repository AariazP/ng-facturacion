import { Component } from '@angular/core';
import { ProductoService } from 'src/app/service/productos.service';
import { AlertService } from 'src/app/utils/alert.service';
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
  
  constructor(private productoService: ProductoService, private alert: AlertService) {
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
    this.alert.confirmAlert('¿Está seguro de eliminar este producto?', 'Este cambio no se puede revertir').then((result) => {

      if(result){
        this.productoService.eliminarPorId(id).subscribe(
          (response) => {
            if(response){
              this.alert.simpleSuccessAlert('Producto eliminado correctamente');
            }
          this.getData();
        }, error => {
          this.alert.simpleErrorAlert(error.error.mensaje);
        });
      }else{
        this.alert.simpleInfoAlert('Operación cancelada');
      }

    }
    );
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
