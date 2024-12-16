import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientesService } from 'src/app/http-services/httpClientes.service';
import { soloTexto, validarCorreo } from '../../../validators/validatorFn';
import { ActualizarClienteDTO } from '../../../dto/cliente/ActualizarClienteDTO';
import { AlertService } from 'src/app/utils/alert.service';
import { ClienteDTO } from '../../../dto/cliente/ClienteDTO';


@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.component.html',
  styleUrls: ['./editar-cliente.component.css']
})
export class EditarClienteComponent {


  @Input() personaEditar!: ClienteDTO;
  @Output() modoOculto = new EventEmitter();
  personaForm!: FormGroup;

  constructor(private fb: FormBuilder, private httpClienteService: HttpClientesService, private alert: AlertService) {
    this.formBuild(fb);
  }
  /**
   * Metodo que crea el formulario reactivo del frontend
   * @param fb 
   */

  formBuild(fb: FormBuilder){
    this.personaForm = this.fb.group({
      idCliente: '',
      cedula: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*'), Validators.maxLength(15)]],
      nombre: ['', [Validators.required, soloTexto()]],
      direccion: ['', [Validators.required,]],
      correo: ['', [Validators.required, validarCorreo()]],
      activo: ['', [Validators.required]],
      fechaCreacion: ['', [Validators.required]],
  
    });

  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['personaEditar'] && this.personaEditar) {
      this.personaForm.patchValue(this.personaEditar);
    }
  }
  

  guardar(): void {

    if (!this.personaForm.valid) {
      
      Object.values(this.personaForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    } 

    let cliente = new ActualizarClienteDTO();
    cliente = cliente.actualizarCliente(this.personaForm.get('cedula')!.value, this.personaForm.get('nombre')!.value, this.personaForm.get('direccion')!.value, this.personaForm.get('correo')!.value, this.personaForm.get('activo')!.value);
    
    this.httpClienteService.actualizar(cliente, this.personaEditar.id).subscribe(
      response => {
        this.alert.simpleSuccessAlert('Cliente editado correctamente');
        this.modoOculto.emit();
      },
      error => {
        this.alert.simpleErrorAlert(error.error.mensaje);
      }
    )
  }

}
