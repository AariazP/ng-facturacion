import { Component, inject } from '@angular/core';
import { ClienteDTO } from '../../../dto/cliente/ClienteDTO';
import { ClienteAlertService } from 'src/app/utils/cliente-alert/clienteAlert.service';
import { ClienteService } from 'src/app/services/domainServices/cliente.service';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.component.html',
  styleUrls: ['./home-cliente.component.css']
})
export class HomeClienteComponent {

  protected clientes: ClienteDTO[];
  private clientesTodos!: ClienteDTO[];
  protected personaEditar: ClienteDTO;
  protected filtroClientes: ClienteDTO[];
  protected modoOculto: boolean = true;
  /* La variable totalClientes se utiliza para mostrar el total de clientes en la tabla
  No es igual a la longitud de filtroClientes porque filtroClientes se actualiza con la búsqueda */
  protected totalClientes: number;
  private alertClient: ClienteAlertService = inject(ClienteAlertService);
  private clienteService: ClienteService = inject(ClienteService);
  protected paginaActual: number = 0;
  protected totalPaginas!: number;
  protected paginas: number[] = [];

  constructor() {
    this.personaEditar = new ClienteDTO();
    this.clientes = [];
    this.filtroClientes = [];
    this.totalClientes = 0;
  }

  ngOnInit() {
    this.listarClientes();
    this.obtenerClientes(this.paginaActual);
    this.obteneClientesTodos();
    this.updateClienteCount();
  }

  /**
   * Actualiza el total de clientes en la tabla
   * Se llama cada vez que se actualiza filtroClientes que es el arreglo que se muestra en la tabla
   * cuando se realiza una búsqueda
   */
  private updateClienteCount(): void {
    this.totalClientes = this.filtroClientes.length;
  }

  /**
   * Este metodo se encarga de guardar en la variable clientesTodos
   * todos los productos que se encuentran en LocalStorage con la variable productos
   */
  obteneClientesTodos() {
    this.clientesTodos = JSON.parse(localStorage.getItem('clientes') || '[]');
  }

  /**
 * Este método se encarga de listar todos los clientes disponibles en la base de datos,
 * haciendo solicitudes hasta que no se reciban más clientes.
 */
protected listarClientes(): void {
  let page = 0;
  this.clientes = [];

  const obtenerClientesRecursivamente = (paginaActual: number): void => {
    this.clienteService.getClientes(paginaActual).subscribe({
      next: (data) => {
        // Si hay clientes en la página actual, se agregan a la lista de clientes
        if (data.content.length > 0) {
          this.clientes = [...this.clientes, ...data.content];

          // Guardar los clientes actualizados en localStorage
          localStorage.setItem('clientes', JSON.stringify(this.clientes));

          // Llama a la siguiente página
          obtenerClientesRecursivamente(paginaActual + 1);
        } else {
          console.log('Todos los clientes han sido cargados:', this.clientes.length);
        }
      },
      error: (err) => {
        console.error('Error al listar clientes:', err);
      }
    });
  };

  // Comienza a obtener clientes desde la primera página
  obtenerClientesRecursivamente(page);
}

  /**
   * Obtiene los clientes del servicio y los asigna a la variable clientes
   */
  private obtenerClientes(page: number): void {
    this.clienteService.obtenerClientes(page).then((page) => {
      this.clientes = page.content;
      this.filtroClientes = page.content;
      this.totalPaginas = page.totalPages;
      this.updateClienteCount();
      this.generarPaginas();
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
        this.obtenerClientes(this.paginaActual);
      } catch (error) { }
    }
  }

  /**
   * Busca un cliente por su cedula, nombre o id
   * @param cedula 
   */
  protected buscar(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const busqueda = inputElement.value.trim().toLowerCase();

    this.filtroClientes = this.clientesTodos.filter((cliente: ClienteDTO) =>
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
  protected editarModoOcuto() {
    this.modoOculto = !this.modoOculto;
    this.obtenerClientes(this.paginaActual);
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
    this.obtenerClientes(this.paginaActual);
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
