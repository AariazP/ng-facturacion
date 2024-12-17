import { Component, DoCheck, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientesService } from 'src/app/http-services/httpClientes.service';
import { HttpProductoService } from 'src/app/http-services/httpProductos.service';
import { AlertService } from 'src/app/utils/alert.service';
import { cantidadMayorQueCero } from 'src/app/validators/validatorFn';
import { FacturaService } from 'src/app/services/venta.service';
import { CrearVentaDTO } from 'src/app/dto/venta/CrearVentaDTO';
import { ProductoDTO } from 'src/app/dto/producto/ProductoDTO';
import { ProductoService } from 'src/app/services/producto.service';
import { ClienteDTO } from 'src/app/dto/cliente/ClienteDTO';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements DoCheck {

  clientes: ClienteDTO[];
  productos: ProductoDTO[];
  clienteSeleccionado: any;
  productoSeleccionado: any;
  formulario!: FormGroup;
  productosForm!: FormGroup;
  protected listProductos: ProductoDTO[];
  modoOculto: boolean = true;

  subtotal: number = 0;
  porcentajeIva: number = 19;
  igv: number = 0;
  totalPagar: number = 0;
  stockProducto:number;
  protected hayStock = true;
  total = 0;

  private formBuilder: FormBuilder = inject(FormBuilder);
  private httpClienteComponent: HttpClientesService = inject(HttpClientesService);
  private productoService: ProductoService = inject(ProductoService);
  private facturaService: FacturaService = inject(FacturaService);

  constructor() {
    this.clientes = [];
    this.productos = [];
    this.listProductos = [];
    this.stockProducto = 0;
  }
  
  ngDoCheck() {
    this.validarFormularios();
  }

  ngOnInit() {
    this.generarIdFactura();
    this.buildForms();
    this.listarProductos();
  }

  /**
   * Este metodo se encarga de construir los formularios de la vista
   */
  buildForms() {
    this.formulario = this.formBuilder.group({
      numFactura: ['', [Validators.required]],
      cliente: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      direccion: ['', [Validators.required]]

    });

    this.productosForm = this.formBuilder.group({
      codigoProducto: ['', [Validators.required]],
      nombreProducto: ['', [Validators.required]],
      precioProducto: ['', [Validators.required]],
      cantidadProducto: [1, [Validators.required, cantidadMayorQueCero()]],
    });
  }

  onSubmit() {

    if (!this.formulario.valid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.validarFormularios();
    let venta = new CrearVentaDTO();
    venta.cliente = this.formulario.get('cliente')!.value;
    venta.usuario = Number(localStorage.getItem('id'));
    if (!this.facturaService.agregarProductosVenta(venta, this.listProductos))return;
    this.facturaService.crearVenta(venta, this.totalPagar).subscribe(
      () => {
        this.formulario.reset();
        this.generarIdFactura();
        this.clienteSeleccionado = null;
        this.resetListProductos();
      },
    );

  }

  /**
   * Este metodo limpia la lista de productos y los valores de la factura
   * 
   */
  resetListProductos(): void {
    this.listProductos = [];
    this.subtotal = 0;
    this.igv = 0;
    this.total = 0;
  }

  generarIdFactura() {
    this.facturaService.generarIdVenta().subscribe(
      (resp: number) => {
        this.formulario.patchValue({
          numFactura: resp
        })
      }
    )
  }

  listarClientes() {
    if (this.clientes.length != 0) {
      return;
    }
    this.httpClienteComponent.obtenerClientes().subscribe(data => {
      this.clientes = data;
    })
  }

  seleccionarCliente(): void {
    let cedula = this.formulario.get('cliente')!.value;

    if (cedula == '') {
      this.formulario.reset();
    }

    this.facturaService.obtenerCliente(cedula).subscribe(
      response => {
        this.formulario.patchValue({
          nombre: response?.nombre,
          direccion: response?.direccion,
          correo: response?.correo
        });
      }
    )
  }

  cambiarModoOculto() {
    this.modoOculto = !this.modoOculto;
  }

  agregarProducto() {

    if (!this.productosForm.valid) {
      Object.values(this.productosForm.controls).forEach(control => control.markAsTouched());
      return;
    }
  
    const cantidad = +this.productosForm.get('cantidadProducto')?.value;
    const codigo = this.productosForm.get('codigoProducto')?.value;
  
    if (!this.productoService.verificarProductoActivo(codigo) || 
        !this.productoService.verificarProductoCantidad(cantidad, codigo)) {
      return;
    }
  
    const precio = this.productosForm.get('precioProducto')?.value;
    const nombre = this.productosForm.get('nombreProducto')?.value;
    const productoExistente = this.listProductos.find(prod => prod.codigo === codigo);
  
    if (productoExistente) {
      productoExistente.cantidad += cantidad;
    } else {
      const producto = ProductoDTO.crearProductoDTO(codigo, nombre, precio, cantidad);
      this.listProductos.push(producto);
    }
    
    this.resetForms();
  
    // Calcular subtotal y otros valores
    this.subtotal = this.listProductos.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
    this.calcularValores();
   
  }

  private resetForms(){
    this.productosForm.reset();
    this.productoSeleccionado = null;
    this.productosForm.get('cantidadProducto')?.setValue(1);
  }
  calcularValores() {
    this.subtotal = this.listProductos.reduce((total: number, producto: ProductoDTO) => total + (producto.precio * producto.cantidad), 0);
    this.igv = this.subtotal * (this.porcentajeIva / 100);
    this.total = this.subtotal;
  }

  eliminarPorId(producto: any) {
    const indice = this.listProductos.indexOf(producto);
    if (indice !== -1) {
      this.listProductos.splice(indice, 1);
      this.calcularValores();
    }
  }

  /**
   * Este metodo se encarga de listar los productos disponibles en la base de datos
   * y asignarlos a la variable productos.
   */
  listarProductos() {
    this.productoService.getProductos().subscribe(
      data => {this.productos = data;}
    );
  }

  /**
   * Este metodo se encarga de seleccionar un producto de la lista de productos
   * cuando se ingresa un codigo de producto en el formulario
   * Asigna los atributos del producto seleccionado a los campos del formulario
   * @returns void
   */
  seleccionarProducto(): void {
    const idProducto = this.productosForm.get('codigoProducto')?.value;
    const producto = this.productos.find(producto => producto.codigo === idProducto);

    if (!producto) {
      this.productosForm.get('codigoProducto')?.setErrors({ productoNoEncontrado: true });
      return;
    }

    this.productoSeleccionado = producto;
    this.stockProducto = producto.cantidad;

    this.productosForm.patchValue({
      nombreProducto: producto
    });
  }

  validarFormularios() {
    if (this.clienteSeleccionado) {
      this.formulario.patchValue({
        ruc: this.clienteSeleccionado.rucDni,
        razonSocial: this.clienteSeleccionado.nombre,
        correo: this.clienteSeleccionado.correo
      });
    } else {
      // Si no hay cliente seleccionado, se deben borrar los valores y marcar los campos como inválidos
      this.formulario.patchValue({
        ruc: '',
        razonSocial: '',
        correo: ''
      });
      this.formulario.get('ruc')?.setValidators(Validators.required);
      this.formulario.get('razonSocial')?.setValidators(Validators.required);
      this.formulario.get('correo')?.setValidators(Validators.required);
    }

    if (this.productoSeleccionado) {
      this.productosForm.patchValue({
        nombreProducto: this.productoSeleccionado.nombre,
        precioProducto: this.productoSeleccionado.precio,

      });
    } else {
      // Si no hay cliente seleccionado, se deben borrar los valores y marcar los campos como inválidos
      this.productosForm.patchValue({
        nombreProducto: '',
        precioProducto: '',

      });
      this.productosForm.get('nombreProducto')?.setValidators(Validators.required);
      this.productosForm.get('precioProducto')?.setValidators(Validators.required);

    }

    // Actualizar la validación de los campos
    this.formulario.get('ruc')?.updateValueAndValidity();
    this.formulario.get('razonSocial')?.updateValueAndValidity();
    this.formulario.get('correo')?.updateValueAndValidity();

    // Actualizar la validación de los campos
    this.productosForm.get('nombreProducto')?.updateValueAndValidity();
    this.productosForm.get('precioProducto')?.updateValueAndValidity();

  }
  /**
   * Este metodo se encarga de validar si la cantidad de producto ingresada
   * es mayor al stock disponible
   * @param event 
   * @returns 
   */
  validarStock(event: any): void {
    const cantidad = event.target.value;
  
    if (cantidad > this.stockProducto) {
      this.productosForm.get('cantidadProducto')?.setErrors({ stockExcedido: true });
      this.productosForm.get('cantidadProducto')?.markAsTouched();
      this.hayStock = false;
      return;
    }
  
    this.productosForm.get('cantidadProducto')?.setErrors(null);
    this.hayStock = true;
  }
  

}