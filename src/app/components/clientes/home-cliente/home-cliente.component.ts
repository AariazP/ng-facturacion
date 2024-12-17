import { Component, inject } from '@angular/core';
import { ClienteDTO } from '../../../dto/cliente/ClienteDTO';
import { ClienteService } from 'src/app/services/cliente.service';
import { ClienteAlertService } from 'src/app/utils/cliente-alert/clienteAlert.service';


@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.component.html',
  styleUrls: ['./home-cliente.component.css']
})
export class HomeClienteComponent {

  protected clientes: ClienteDTO[]; 
  protected personaEditar: ClienteDTO;
  protected filtroClientes: ClienteDTO [];
  protected modoOculto: boolean = true;
  /* La variable totalClientes se utiliza para mostrar el total de clientes en la tabla
  No es igual a la longitud de filtroClientes porque filtroClientes se actualiza con la búsqueda */
  protected totalClientes: number; 
  private alertClient: ClienteAlertService = inject(ClienteAlertService);
  private clienteService: ClienteService = inject(ClienteService);

  constructor() {
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
    this.clienteService.obtenerClientes().subscribe((clientes) => {
      this.clientes = clientes;
      this.filtroClientes = clientes;
      this.updateClienteCount();
    });
  }

  /**
   * Elimina un cliente por su id, muestra un mensaje de confirmación antes de eliminar
   * La cedula es diferente al id, el id es un número único que se asigna a cada cliente
   * @param id 
   */
  async eliminarPorId(id: number) {
    const result = await this.alertClient.eliminarCliente();
    if (result) {
      try {
        await this.clienteService.eliminarClienteId(id);
        this.obtenerClientes(); 
      } catch (error) {}
    }
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
