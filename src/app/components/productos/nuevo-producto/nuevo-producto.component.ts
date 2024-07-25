import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { soloTexto, validarCorreo, validarDecimalConDosDecimales } from 'src/app/validators/validatorFn';
import { ProductoService } from 'src/app/service/productos.service';
import { CrearProductoDTO } from 'src/app/DTO/producto/CrearProductoDTO';
import { AlertService } from 'src/app/utils/alert.service';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.component.html',
  styleUrls: ['./nuevo-producto.component.css']
})
export class NuevoProductoComponent implements OnInit {

  formulario: FormGroup;
  existe: boolean = false;
  tipoImpuesto!: string[];

  constructor(private formBuilder: FormBuilder, private productoService: ProductoService, 
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
    this.productoService.getTipoImpuesto().subscribe(
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

    this.productoService.enviarDatos(producto).subscribe(
      response => {
        this.alert.simpleSuccessAlert('Producto guardado correctamente');
        this.formulario.reset();
      }, error => {
        this.alert.simpleErrorAlert(error.error.mensaje);
      });
  }

  validarCodigo(event: any) {
    const input = event.target as HTMLInputElement;
  
    // Eliminar cualquier validación anterior
    //this.formulario.get('codigo')!.setErrors(null);
    this.existe = false;
  
    const delay = 300;
  
    setTimeout(() => {
      this.productoService.verificarExistencia(input.value).subscribe(data => {
        if (data) {
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
