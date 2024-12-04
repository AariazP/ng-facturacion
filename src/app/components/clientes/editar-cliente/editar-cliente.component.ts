import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientesService } from 'src/app/service/clientes.service';
import { soloTexto, validarCorreo } from '../../../validators/validatorFn';
import { ActualizarClienteDTO } from 'src/app/DTO/cliente/ActualizarClienteDTO';
import { AlertService } from 'src/app/utils/alert.service';


@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.component.html',
  styleUrls: ['./editar-cliente.component.css']
})
export class EditarClienteComponent {

  //TODO: Implementar la edición de un cliente 
  @Input() personaEditar: any = {};
  idCliente!: number;
  @Output() modoOculto = new EventEmitter();
  personaForm: FormGroup;

  constructor(private fb: FormBuilder, private clienteService: ClientesService, 
    private alert: AlertService
  ) {
    this.idCliente = this.personaEditar.id;
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
    cliente.cedula = this.personaForm.get('cedula')!.value;
    cliente.nombre = this.personaForm.get('nombre')!.value;
    cliente.direccion = this.personaForm.get('direccion')!.value;
    cliente.correo = this.personaForm.get('correo')!.value;
    cliente.activo = this.personaForm.get('activo')!.value; 
    
    this.clienteService.actualizar(cliente, this.personaEditar.id).subscribe(
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
