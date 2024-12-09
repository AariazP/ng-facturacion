import { Injectable } from "@angular/core";
import { HttpClientesService } from "../http-services/httpClientes.service";
import { CrearClienteDTO } from "../dto/cliente/CrearClienteDTO";
import { AlertService } from "../utils/alert.service";

@Injectable({
    providedIn: 'root'
  })
export class ClienteService {
    
  constructor(private clientesService: HttpClientesService, private alertService: AlertService) {}

  crearCliente(cliente: CrearClienteDTO){
    return this.clientesService.crearCliente(cliente).subscribe({
      next: () => this.alertService.simpleSuccessAlert("Cliente guardado correctamente"),
      error: () => this.alertService.simpleErrorAlert("Error al guardar cliente") 
    });
  }

}