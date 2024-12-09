import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { soloTexto, validarCorreo} from 'src/app/validators/validatorFn';
import { CrearClienteDTO } from 'src/app/dto/cliente/CrearClienteDTO';
import { ClienteService } from 'src/app/services/cliente.service';
import { ClienteAlertService } from 'src/app/utils/cliente-alert/clienteAlert.service';
@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoComponent {

  protected formulario!: FormGroup;
  protected existe: boolean = false;
  private formBuilder:FormBuilder = inject(FormBuilder);
  private clienteService: ClienteService = inject(ClienteService);
  private clientAlert: ClienteAlertService = inject(ClienteAlertService);

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      cedula: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(15)]],
      nombre: ['', [Validators.required, soloTexto()]],
      direccion: ['', [Validators.required]],
      correo: ['', [Validators.required, validarCorreo()]],
      activo: [1],
    });
  }

  onSubmit() {
    if (!this.formulario.valid) {
      this.marcarCamposComoTocados();
    }else{
      const { cedula, nombre, direccion, correo } = this.formulario.value;
      const cliente = CrearClienteDTO.crearCliente(cedula, nombre, direccion, correo);
      this.clienteService.crearCliente(cliente);
      this.formulario.reset();
    }
  }

  /**
   * Marca todos los controles del formulario como tocados.
   */
  private marcarCamposComoTocados(): void {
    Object.values(this.formulario.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  /**
   * Evento que se dispara al escribir en el campo cedula.
   * verifica si la cedula ya existe en la base de datos.
   * @param event  evento de teclado
   */
  protected validarCedulaNuevoCliente(event: any) {
    const input = this.formulario.get('cedula')!.value;
    this.existe = false;
    const delay = 300;

    if (!input) return;

    setTimeout(() => {
      this.verificarClienteExisteCedula(input);
    }, delay);
  }

  /**
   * Este metodo verifica si la cedula del cliente ya existe en la base de datos.
   * @param input cedula del cliente
   */
  private verificarClienteExisteCedula(input: string) {
    this.clienteService.obtenerCliente(input).subscribe({
      next: (data) => {

        if (data != null) {
          this.recuperarClienteEliminado(input);
          this.existe = true;
          this.formulario.get('cedula')!.setErrors({ codigoExistente: true });

        } else {
          this.formulario.get('cedula')!.setErrors(null);
          this.existe = false;
        }
      }
    });
  }

  /**
   * Este metodo verifica si el cliente fue eliminado anteriormente.
   * @param input cedula del cliente
   */
  private recuperarClienteEliminado(input: string) {
    this.clienteService.fueEliminado(input).subscribe({
      next: async (data) => {
        if (data) {
          const response = await this.clientAlert.preguntarRecuperarCliente();
          if (response) {
            this.clienteService.recuperarCliente(input);
          }          
        }
      }
    });
  }

}
