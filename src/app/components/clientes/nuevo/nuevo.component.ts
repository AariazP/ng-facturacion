import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { soloTexto, validarCorreo, validarDecimalConDosDecimales } from 'src/app/validators/validatorFn';
import { HttpClientesService } from 'src/app/http-services/httpClientes.service';
import { CrearClienteDTO } from 'src/app/dto/cliente/CrearClienteDTO';
import { AlertService } from 'src/app/utils/alert.service';
import Swal from 'sweetalert2';
import { ClienteService } from 'src/app/services/cliente.service';
import { ClienteAlertService } from 'src/app/utils/cliente-alert/clienteAlert.service';
@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoComponent {

  formulario!: FormGroup;
  existe: boolean = false;
  constructor(private formBuilder: FormBuilder, private clienteService: ClienteService, private clientAlert: ClienteAlertService) {
    this.formBuild(formBuilder);
  }

  /**
   * Metodo que crea el formulario reactivo del frontend
   * @returns void
   */
  formBuild(fb: FormBuilder) {
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
      Object.values(this.formulario.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    let cliente = new CrearClienteDTO();
    cliente = cliente.crearCliente(this.formulario.get('cedula')!.value, this.formulario.get('nombre')!.value, this.formulario.get('direccion')!.value, this.formulario.get('correo')!.value)

    this.clienteService.crearCliente(cliente);
    this.formulario.reset();
  }

  validarCodigo(event: any) {
    const input = this.formulario.get('cedula')!.value;
    this.existe = false;
    const delay = 300;

    if (!input) return;

    setTimeout(() => {
      this.verificarClienteExisteCedula(input);
    }, delay);
  }

  verificarClienteExisteCedula(input: string) {
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

  recuperarClienteEliminado(input: string) {

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
