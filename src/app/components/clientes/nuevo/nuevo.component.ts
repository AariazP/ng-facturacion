import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { soloTexto, validarCorreo, validarDecimalConDosDecimales } from 'src/app/validators/validatorFn';
import { HttpClientesService } from 'src/app/http-services/httpClientes.service';
import { CrearClienteDTO } from 'src/app/dto/cliente/CrearClienteDTO';
import { AlertService } from 'src/app/utils/alert.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoComponent {

  formulario!: FormGroup;
  existe: boolean = false;
  constructor(private formBuilder: FormBuilder,private clientesService: HttpClientesService, private alertService: AlertService) {
    this.formBuild(formBuilder);
  }

  /**
   * Metodo que crea el formulario reactivo del frontend
   * @returns void
   */
  formBuild(fb: FormBuilder){
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

    this.clientesService.enviarDatos(cliente).subscribe(response => {

      this.alertService.simpleSuccessAlert("Cliente guardado correctamente");
      
    }, error => {
      this.alertService.simpleErrorAlert(error.error.mensaje);
    });
    this.formulario.reset();
  }

  validarCodigo(event: any) {

    const input = this.formulario.get('cedula')!.value
    this.existe = false;
    const delay = 300;
  
    if(input == null || input=='') return;
    setTimeout(() => {
      this.clientesService.obtenerCliente(input).subscribe(data => {
        if ( data != null) {	

          this.clientesService.fueEliminado(input).subscribe(response => {

            if(response){
              Swal.fire({
                title: "Este cliente fue eliminado antes",
                text: "¿Te gustaría recuperarlo?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, recuperar", 
                cancelButtonText: "No, cancelar"
              }).then((result) => {
                if (result.isConfirmed) {

                  this.clientesService.recuperarCliente(input).subscribe(response => {
                    Swal.fire({
                      title: "Recuperado!",
                      text: "El cliente ha sido recuperado.",
                      icon: "success"
                    });
                  });
                }
              });
            }

          });

          this.existe = true;
          this.formulario.get('cedula')!.setErrors({ 'codigoExistente': true });

        } else {

          this.formulario.get('cedula')!.setErrors(null);
          this.existe = false;

        }
      }, 
      error => {

      }
    );
    }, delay);
  }


  
}
