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
  private updateClienteCount():void {
    this.totalClientes = this.filtroClientes.length;
  }

  /**
   * Obtiene los clientes del servicio y los asigna a la variable clientes
   */
  private obtenerClientes(): void {
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
  protected async eliminarPorId(id: number): Promise<void> {
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
  protected buscar(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const busqueda = inputElement.value.trim().toLowerCase();
  
    this.filtroClientes = this.clientes.filter((cliente: ClienteDTO) =>
      this.coincideBusqueda(cliente, busqueda)
    );
  
    this.updateClienteCount();
  }
  
  /**
   * Este método verifica si un cliente coincide con la búsqueda
   * @param cliente DTO del cliente
   * @param busqueda String de búsqueda
   * @returns boolean que indica si el cliente coincide con la búsqueda
   */
  private coincideBusqueda(cliente: ClienteDTO, busqueda: string): boolean {
    return (
      cliente.id.toString().includes(busqueda) ||
      cliente.cedula.toLowerCase().includes(busqueda) ||
      cliente.nombre.toLowerCase().includes(busqueda)
    );
  }
  

  /**
   * Cambia el modo de edición de la tabla
   * Si el modo de edición está activo, se desactiva y viceversa
   * @param persona 
   */
  protected toggleModoEdicion(persona: ClienteDTO) {
    this.personaEditar = persona;
    this.editarModoOcuto();
  }

  /**
   * Cambia del modo de edición al modo oculto
   */
  protected editarModoOcuto(){
    this.modoOculto = !this.modoOculto;
    this.obtenerClientes();
  }


}
