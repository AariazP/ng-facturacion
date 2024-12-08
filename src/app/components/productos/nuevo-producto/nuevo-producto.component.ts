import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpProductoService } from 'src/app/http-services/httpProductos.service';
import { CrearProductoDTO } from 'src/app/dto/producto/CrearProductoDTO';
import { AlertService } from 'src/app/utils/alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.component.html',
  styleUrls: ['./nuevo-producto.component.css']
})
export class NuevoProductoComponent implements OnInit {

  formulario: FormGroup;
  existe: boolean = false;
  tipoImpuesto!: string[];

  constructor(private formBuilder: FormBuilder, private httpProductoService: HttpProductoService, 
    private alert: AlertService
  ) {
    this.formulario = this.formBuilder.group({
      codigo: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]],
      nombre: ['', [Validators.required]],
      precio: [''],
      stock: [''],
      impuesto: [''],
      activo: [1],
    });
  }
  ngOnInit(): void {
    this.httpProductoService.getTipoImpuesto().subscribe(
      data => {
        this.tipoImpuesto = data;
      }, 
      error => {
        console.error(error);
      });
  }

  onSubmit() {

    if (!this.formulario.valid) {
      Object.values(this.formulario.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    let producto = new CrearProductoDTO();
    producto.codigo = this.formulario.get('codigo')!.value;
    producto.nombre = this.formulario.get('nombre')!.value;
    producto.precio = this.formulario.get('precio')!.value;
    producto.cantidad = this.formulario.get('stock')!.value;
    producto.activo = this.formulario.get('activo')!.value;
    producto.impuesto = this.tipoImpuesto[this.formulario.get('impuesto')!.value] == undefined ? '':this.tipoImpuesto[this.formulario.get('impuesto')!.value];

    this.httpProductoService.enviarDatos(producto).subscribe(
      response => {
        this.alert.simpleSuccessAlert('Producto guardado correctamente');
        this.formulario.reset();
      }, error => {
        this.alert.simpleErrorAlert(error.error.mensaje);
      });
  }

  validarCodigo(event: any) {
    const input = event.target as HTMLInputElement;
    this.existe = false;
  
    const delay = 300;
  
    setTimeout(() => {
      this.httpProductoService.verificarExistencia(input.value).subscribe(data => {
        if (data) {

          this.httpProductoService.fueEliminado(input.value).subscribe(
            response => {
              if (response) {
                Swal.fire({
                  title: "Este producto fue eliminado antes",
                  text: "¿Te gustaría recuperarlo?",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Sí, recuperar", 
                  cancelButtonText: "No, cancelar"
                }).then((result) => {
                  if (result.isConfirmed) {
  
                    this.httpProductoService.recuperarProducto(input.value).subscribe(response => {
                      Swal.fire({
                        title: "Recuperado!",
                        text: "El producto ha sido recuperado.",
                        icon: "success"
                      });
                    });
                  }
                });
              }
            });



          this.existe = true;
          this.formulario.get('codigo')!.setErrors({ 'codigoExistente': true });
        } else {
          //this.formulario.get('codigo')!.setErrors(null);
          this.existe = false;
        }
      });
    }, delay);
  }

}
