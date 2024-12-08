import { Component } from '@angular/core';
import { ClienteDTO } from 'src/app/dto/cliente/ClienteDTO';
import { HttpClientesService } from 'src/app/http-services/httpClientes.service';
import { AlertService } from 'src/app/utils/alert.service';
@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.component.html',
  styleUrls: ['./home-cliente.component.css']
})
export class HomeClienteComponent {

  clientes: ClienteDTO[]; 
  personaEditar: ClienteDTO;
  filtroClientes: ClienteDTO [];
  modoOculto: boolean = true;
  /* La variable totalClientes se utiliza para mostrar el total de clientes en la tabla
  No es igual a la longitud de filtroClientes porque filtroClientes se actualiza con la búsqueda */
  totalClientes: number; 

  constructor(private httpclientesService: HttpClientesService, private alert: AlertService) {
    this.personaEditar = new ClienteDTO();
    this.clientes = [];
    this.filtroClientes = [];
    this.totalClientes = 0;
  }

  ngOnInit() {
   this.obtenerClientes();
   this.updateClienteCount();
  }
  
  /**
   * Actualiza el total de clientes en la tabla
   * Se llama cada vez que se actualiza filtroClientes que es el arreglo que se muestra en la tabla
   * cuando se realiza una búsqueda
   */
  updateClienteCount() {
    this.totalClientes = this.filtroClientes.length;
  }

  /**
   * Obtiene los clientes del servicio y los asigna a la variable clientes
   */
  obtenerClientes(){
    this.httpclientesService.obtenerClientes().subscribe(data => {
      this.clientes = data;
      this.filtroClientes = data;
      this.updateClienteCount(); 
    },
    error => {
      this.alert.simpleErrorAlert(error.error.mensaje);
    });
  }

  /**
   * Elimina un cliente por su id, muestra un mensaje de confirmación antes de eliminar
   * La cedula es diferente al id, el id es un número único que se asigna a cada cliente
   * @param id 
   */
  eliminarPorId(id: number) {
   
    this.alert.confirmAlert('¿Está seguro de eliminar este cliente?', 'Este cambio no se puede revertir').then((result) => {

      if(result){
        this.httpclientesService.eliminarPorId(id).subscribe(
          (response) => {
            
            if(response)this.alert.simpleSuccessAlert('Cliente eliminado correctamente');
            
          this.obtenerClientes();
        }, error => {
          this.alert.simpleErrorAlert(error.error.mensaje);
        });
      }else{
        this.alert.simpleInfoAlert('Operación cancelada');3
      }

    });

    
  }

  /**
   * Busca un cliente por su cedula, nombre o id
   * @param cedula 
   */  
  buscar(texto: Event) {
    const busqueda = (texto.target as HTMLInputElement).value.toLocaleLowerCase();
    this.filtroClientes = this.clientes.filter( (cliente: any) =>
      cliente.id.toString().includes(busqueda) ||
      cliente.cedula.toLowerCase().includes(busqueda) ||
      cliente.nombre.toLowerCase().includes(busqueda)
    );
    this.updateClienteCount(); 
  }

  /**
   * Cambia el modo de edición de la tabla
   * Si el modo de edición está activo, se desactiva y viceversa
   * @param persona 
   */
  toggleModoEdicion(persona: ClienteDTO) {
    this.personaEditar = persona;
    this.editarModoOcuto();
  }

  /**
   * Cambia del modo de edición al modo oculto
   */
  editarModoOcuto(){
    this.modoOculto = !this.modoOculto;
    this.obtenerClientes();
  }


}
