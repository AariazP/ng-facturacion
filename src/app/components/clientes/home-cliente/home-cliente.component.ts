import { Component } from '@angular/core';
import { ClientesService } from 'src/app/service/clientes.service';
import { AlertService } from 'src/app/utils/alert.service';
@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.component.html',
  styleUrls: ['./home-cliente.component.css']
})
export class HomeClienteComponent {

  clientes: any ; 
  personaEditar: any;
  filtroClientes: any [] = [];
  modoOculto: boolean = true;
  totalClientes: number = 0;

  constructor(private clientesService: ClientesService,
    private alert: AlertService
  ) {
  }
  ngOnInit() {
   this.getData();
   this.updateClienteCount();
  }
  
  updateClienteCount() {
    this.totalClientes = this.filtroClientes.length;
  }

  getData(){
    this.clientesService.getData().subscribe(data => {
      this.clientes = data;
      this.filtroClientes = data;
      this.updateClienteCount(); // Actualiza el conteo cuando se obtienen los datos
    })
  }
  
  eliminarPorId(id: number) {

    
    this.alert.confirmAlert('¿Está seguro de eliminar este cliente?', 'Este cambio no se puede revertir').then((result) => {

      if(result){
        this.clientesService.eliminarPorId(id).subscribe(
          (response) => {
            if(response){
              this.alert.simpleSuccessAlert('Cliente eliminado correctamente');
            }
          this.getData();
        }, error => {
          this.alert.simpleErrorAlert(error.error.mensaje);
        });
      }else{
        this.alert.simpleInfoAlert('Operación cancelada');3
      }

    });

    
  }

  buscar(texto: Event) {
    const input = texto.target as HTMLInputElement;
    this.filtroClientes = this.clientes.filter( (cleinte: any) =>
      cleinte.id.toString().includes(input.value.toLowerCase()) ||
      cleinte.cedula.toLowerCase().includes(input.value.toLowerCase()) ||
      cleinte.nombre.toLowerCase().includes(input.value.toLowerCase())
    );
    this.updateClienteCount(); 
  }
//
  toggleModoEdicion(persona: any) {
    this.personaEditar = persona;
    this.editarModoOcuto();
  }

  editarModoOcuto(){
    this.modoOculto = !this.modoOculto;
    this.getData();
  }



}
