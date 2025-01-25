import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpProductoService } from 'src/app/services/http-services/httpProductos.service';
import { CrearProductoDTO } from '../../../dto/producto/CrearProductoDTO';
import { AlertService } from 'src/app/utils/alert.service';
import { ProductoAlertService } from 'src/app/utils/product-alert/productoAlert.service';
import { from, of, switchMap } from 'rxjs';
import { ProductoService } from 'src/app/services/domainServices/producto.service';
import { FormaVenta } from 'src/app/dto/formasVenta/FormaVenta';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.component.html',
  styleUrls: ['./nuevo-producto.component.css']
})
export class NuevoProductoComponent implements OnInit {

  protected formulario!: FormGroup;
  existe: boolean = false;
  protected tipoImpuesto!: string[];
  protected valorNumerico: number = 0;
  protected valorFormateado: string = '';
  private formBuilder: FormBuilder = inject(FormBuilder);
  private httpProductoService: HttpProductoService = inject(HttpProductoService);
  private alert: AlertService = inject(AlertService);
  private productoService: ProductoService = inject(ProductoService);
  private productoAlertService: ProductoAlertService = inject(ProductoAlertService);


  ngOnInit(): void {
    this.buildForm();
    this.obtenerImpuesto();
  }

  /**
   * Obtiene los tipos de impuesto de la base de datos
   * @returns void
   */
  private obtenerImpuesto(): void {
    this.productoService.getTipoImpuesto().subscribe({
      next: (data) => { this.tipoImpuesto = data; }
    });
  }

  agregarFila() {
    this.formasVenta.push(
      this.formBuilder.group({
        nombre: [''],
        precio: [''],
        cantidad: [1]
      })
    );
  }


  /**
   * Construye el formulario de productos
   */
  private buildForm(): void {
    this.formulario = this.formBuilder.group({
      codigo: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]],
      nombre: ['', [Validators.required]],
      precio: [''],
      stock: [''],
      impuesto: [''],
      precioCompra: [''],
      formasVenta: this.formBuilder.array([])
    });
  }

  get formasVenta(): FormArray {
    return this.formulario.get('formasVenta') as FormArray;
  }

  /**
   * Este método se encarga de guardar un producto en la base de datos
   * @returns void
   */
  onSubmit(): void {
    
    if (!this.formulario.valid) {
      Object.values(this.formulario.controls).forEach(control => { control.markAsTouched(); });
      return;
    }
    const { codigo, nombre, precioCompra } = this.formulario.value;
    const formasVentaEntities = this.formasVenta.controls.map(forma =>FormaVenta.toEntity(forma as FormGroup));
    let impuesto = this.tipoImpuesto[this.formulario.get('impuesto')!.value] == undefined ? '':this.tipoImpuesto[this.formulario.get('impuesto')!.value];
    let producto = CrearProductoDTO.crearProductoDTO(codigo, nombre,impuesto, precioCompra, formasVentaEntities);
    this.productoService.guardarProducto(producto);
    this.formulario.reset();
  }

  /**
   * Método que se encarga de formatear el valor de un input
   * @param event Evento que se dispara al escribir en un input
   */
  protected formatearValor(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Obtener y formatear el valor
    const valorNumerico = this.obtenerValorNumerico(input.value);
    // Actualizar el valor formateado
    input.value = this.actualizarValorFormateado(valorNumerico);
  }

  /**
   * Este método se encarga de obtener el valor numérico de un string
   * @param valor Valor a convertir
   * @returns Valor numérico o null si no se puede convertir
   */
  private obtenerValorNumerico(valor: string): number | null {
    const valorSinFormato = valor.replace(/[^\d]/g, ''); // Elimina caracteres no numéricos
    const valorNumerico = parseInt(valorSinFormato, 10);
    return isNaN(valorNumerico) ? null : valorNumerico;
  }

  /**
   * Este método se encarga de actualizar el valor formateado de un input
   * @param valor Valor numérico a formatear
   * @returns Valor formateado
   */
  private actualizarValorFormateado(valor: number | null): string {
    if (valor !== null) {
      this.valorFormateado = valor.toLocaleString('en-US'); // Formato con comas
      return this.valorFormateado;
    }
    this.valorFormateado = '';
    return '';
  }

  /**
   * Este método se encarga de validar si un código del producto existe
   * @param event Evento que se dispara al escribir en un input
   */
  public validarCodigo(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.existe = false;

    const delay = 300;
    setTimeout(() => {
      this.verificarCodigo(input.value);
    }, delay);
  }

  /**
   * Este método se encarga de verificar si un código de producto existe
   * en la base de datos pero fue eliminado anteriormente
   * @param codigo 
   */
  private verificarCodigo(codigo: string): void {
    this.httpProductoService.verificarExistencia(codigo).subscribe(data => {
      if (data) {
        this.manejarCodigoExistente(codigo);
      } else {
        this.establecerErrorFormulario(false);
      }
    });
  }

  /**
   * Este método se encarga de manejar un código existente
   * la idea es mostrar un mensaje de confirmación para recuperar el producto
   * si el producto fue eliminado anteriormente
   * @param codigo 
   */
  private async manejarCodigoExistente(codigo: string): Promise<void> {
    this.productoService.fueEliminado(codigo)
      .pipe(switchMap(response => {
        if (response) {
          return from(this.productoAlertService.mostrarConfirmacionRecuperacion(codigo));
        }
        return of(false);
      }))
      .subscribe(resp => {
        if (resp) this.recuperarProducto(codigo);
      });

    this.existe = true;
    this.establecerErrorFormulario(true);
  }

  /**
   * Este método se encarga de recuperar un producto eliminado
   * @param codigo 
   */
  private recuperarProducto(codigo: string): void {
    this.productoService.recuperarProducto(codigo).subscribe(() => {
      this.alert.simpleSuccessAlert('Producto recuperado correctamente');
    });
  }

  /**
   * Este método se encarga de establecer un error en el formulario
   * cuando un código de producto existe
   * @param existe 
   */
  private establecerErrorFormulario(existe: boolean): void {
    const control = this.formulario.get('codigo');
    if (control) {
      if (existe) {
        control.setErrors({ 'codigoExistente': true });
      } else {
        control.setErrors(null);
      }
    }
  }


}
