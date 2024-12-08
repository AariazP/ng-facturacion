import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from 'src/app/service/productos.service';
import { Router } from '@angular/router';
import { soloTexto, validarCorreo, validarDecimalConDosDecimales } from '../../../validators/validatorFn';
import { ActualizarProductoDTO } from 'src/app/dto/producto/ActualizarProductoDTO';
import { AlertService } from 'src/app/utils/alert.service';
@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.css']
})
export class EditarProductoComponent {

  
  
  @Input() productosEditar: any = {};
  @Output() modoOculto = new EventEmitter();
  personaForm: FormGroup;


  constructor(private fb: FormBuilder,
     private productoService: ProductoService, 
    private alert: AlertService) {
    this.personaForm = this.fb.group({
      idProducto: '',
      codigo: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]],
      nombre: ['', [Validators.required]],
      precio: ['', [Validators.required, validarDecimalConDosDecimales()]],
      cantidad: ['', [Validators.required, validarDecimalConDosDecimales()]],
      activo: [1],
      fechaCreacion: ['', [Validators.required]],
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productosEditar'] && this.productosEditar) {
      this.personaForm.patchValue(this.productosEditar);
    }
  }
  

  guardar(): void {
    
    let productoActualizar = new ActualizarProductoDTO();
    productoActualizar.codigo = this.productosEditar.codigo;
    productoActualizar.nombre = this.personaForm.get('nombre')!.value;
    productoActualizar.precio = this.personaForm.get('precio')!.value;
    productoActualizar.cantidad = this.personaForm.get('cantidad')!.value;
    productoActualizar.activo = this.personaForm.get('activo')!.value == 1;

    if (!this.personaForm.valid) {
      Object.values(this.personaForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    } 
    this.productoService.actualizar(productoActualizar).subscribe(
      response => {
        
        this.alert.simpleSuccessAlert('Producto actualizado correctamente');
        this.modoOculto.emit();
      
      },
      error => {
        this.alert.simpleErrorAlert(error.error.mensaje);	
      }

    )
  }

}
