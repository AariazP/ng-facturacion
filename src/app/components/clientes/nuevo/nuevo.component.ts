import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { soloTexto, validarCorreo, validarDecimalConDosDecimales } from 'src/app/validators/validatorFn';
import { ClientesService } from 'src/app/service/clientes.service';
import { CrearClienteDTO } from 'src/app/DTO/cliente/ClienteDTO';
import { AlertService } from 'src/app/utils/alert.service';
@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoComponent {

  formulario: FormGroup;
  existe: boolean = false;
  constructor(private formBuilder: FormBuilder,
      private clientesService: ClientesService,
      private alertService: AlertService) {
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
    cliente.cedula = this.formulario.get('cedula')!.value;
    cliente.nombre = this.formulario.get('nombre')!.value;
    cliente.direccion = this.formulario.get('direccion')!.value;
    cliente.correo = this.formulario.get('correo')!.value;

    this.clientesService.enviarDatos(cliente).subscribe(response => {

      this.alertService.simpleSuccessAlert("Cliente guardado correctamente");
      
    }, error => {
      this.alertService.simpleErrorAlert(error.error.mensaje);
    });
    this.formulario.reset();
  }

  validarCodigo(event: any) {

    const input = event.target as HTMLInputElement;
    this.existe = false;
    const delay = 300;
  
    setTimeout(() => {
      this.clientesService.verificarExistencia(input.value).subscribe(data => {
        if ( parseInt(data.data) > 0 ) {	
          this.existe = true;
          console.log('El código ya existe', data.data);

          this.formulario.get('cedula')!.setErrors({ 'codigoExistente': true });
        } else {
          this.formulario.get('cedula')!.setErrors(null);
          this.existe = false;
        }
      });
    }, delay);
  }


  
}
