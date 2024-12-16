import { Component, DoCheck, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrearVentaDTO } from 'src/app/dto/venta/CrearVentaDTO';
import { HttpClientesService } from 'src/app/http-services/httpClientes.service';
import { HttpFacturasService } from 'src/app/http-services/httpFacturas.service';
import { HttpProductoService } from 'src/app/http-services/httpProductos.service';
import { AlertService } from 'src/app/utils/alert.service';
import { cantidadMayorQueCero} from 'src/app/validators/validatorFn';
import { jsPDF } from 'jspdf';
import { FacturaService } from 'src/app/services/factura.service';

@Component({
  selector: 'app-cabfactura',
  templateUrl: './cabfactura.component.html',
  styleUrls: ['./cabfactura.component.css']
})
export class CabfacturaComponent implements DoCheck {

  clientes: any[] = [];
  productos: any[] = [];
  datosCabecera: any = {};
  clienteSeleccionado: any; 
  productoSeleccionado: any; 
  formulario!: FormGroup;
  productosForm!: FormGroup;
  listProductos: any[] = [];
  modoOculto: boolean = true;

  subtotal: number = 0;
  porcentajeIva: number = 19;
  igv: number = 0;
  totalPagar: number = 0;
  stockProducto = '';
  hayStock = true;
  total=0;

  private formBuilder: FormBuilder = inject(FormBuilder);
  private httpClienteComponent: HttpClientesService = inject(HttpClientesService);
  private httpFacturasService: HttpFacturasService = inject(HttpFacturasService);
  private httpProductoService: HttpProductoService = inject(HttpProductoService);
  private alert : AlertService = inject(AlertService);
  private facturaService: FacturaService = inject(FacturaService);

  ngDoCheck() {
    this.validarFormularios();
  } 
  
  ngOnInit(){
    this.generarIdFactura();
    this.buildForms();
  }

  buildForms() {
    this.formulario = this.formBuilder.group({
      numFactura: ['', [Validators.required]],
      cliente: ['', [Validators.required]],
      nombre: ['', [Validators.required ]],
      direccion: ['', [Validators.required]]
      
    });

    this.productosForm = this.formBuilder.group({
      codProducto: ['', [Validators.required]],
      nombreProducto: ['', [Validators.required]],
      precioProducto: ['', [Validators.required]],
      cantidadProducto: [1, [Validators.required, cantidadMayorQueCero() ]],
    });
  }

  async onSubmit() {

    if (!this.formulario.valid ) {
      this.formulario.markAllAsTouched();
      return;
    }
  

    let factura = new CrearVentaDTO();
    factura.cliente = this.formulario.get('cliente')!.value;
    factura.usuario = Number(localStorage.getItem('id'));

    this.facturaService.agregarProductosAFactura(factura, this.listProductos);

    

    this.facturaService.crearFactura(factura, this.totalPagar);
    
    this.formulario.reset();
    this.generarIdFactura();
    this.clienteSeleccionado = null;
    this.resetListProductos();
     
  }

  resetListProductos(): void {
    this.listProductos = [];
    this.subtotal = 0;
    this.igv = 0;
    this.total = 0;
  }
  generarIdFactura(){
    this.facturaService.generarIdFactura().subscribe(
      (resp: any) => {
        this.formulario.patchValue({
          numFactura: resp
        })
      }
    )
  }
  
  

  listarClientes() {
    if(this.clientes.length != 0){
      return;
    }
    this.httpClienteComponent.obtenerClientes().subscribe(data => {
      this.clientes = data;
    })
  }

  seleccionarCliente(): void{
    let cedula = this.formulario.get('cliente')!.value;

    if(cedula == ''){ 
      this.formulario.reset();
      //this.generarFactura();
    }


    this.httpClienteComponent.obtenerCliente(cedula).subscribe(
      response => {
        this.formulario.patchValue({
          nombre: response.nombre,
          direccion: response.direccion,
          correo: response.correo
        });
      }, 
      error => {
      }
    )
  }

  cambiarModoOculto(){
    this.modoOculto = !this.modoOculto;
  }

  agregarProducto(){  

    if (!this.productosForm.valid) {
      Object.values(this.productosForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    } 

    let cantidad = +this.productosForm.get('cantidadProducto')?.value;
    let codigo = this.productosForm.get('codProducto')?.value;

    this.httpProductoService.verificarActivo(codigo).subscribe(
      (response) => {
        if (!response) {
          this.alert.simpleErrorAlert('El producto no está activo');
          return;
        }
      }
    )

    this.httpProductoService.verificarCantidad(cantidad, codigo).subscribe(
      (response) => {
        if (!response) {
        this.alert.simpleErrorAlert('La cantidad de productos supera el stock disponible');
          return;
        }else{
          this.listProductos.push(this.productosForm.value);
          this.productosForm.reset();
          this.productoSeleccionado = null;
          this.productosForm.get('cantidadProducto')?.setValue(1);

          this.subtotal = this.listProductos.reduce((total, producto) => total + producto.precioProducto, 0);

          this.calcularValores(this.listProductos);
        }
      }
    );


    
  }

  calcularValores( list: any){
    this.subtotal = list.reduce((total: any, producto: any) => total + (producto.precioProducto * producto.cantidadProducto), 0);
    this.igv = this.subtotal * (this.porcentajeIva / 100);
    this.total = this.subtotal;
  }
  
  eliminarPorId(producto: any) {
    const indice = this.listProductos.indexOf(producto);
    if (indice !== -1) {
      this.listProductos.splice(indice, 1);
      this.calcularValores(this.listProductos);
    }
  }


  listarProductos() {
    if(this.productos.length != 0){
      return;
    }
    this.httpProductoService.getData().subscribe(data => {
      this.productos = data;
    })
  }

  seleccionarProducto(): void{
    let idProducto = this.productosForm.get('codProducto')?.value
    this.productoSeleccionado = this.productos.find( producto => producto.codigo == idProducto);
    this.stockProducto = this.productoSeleccionado.cantidad;
    if(this.productoSeleccionado != null && this.productoSeleccionado != undefined){
      this.productosForm.patchValue({
      nombreProducto: this.productoSeleccionado.nombre
      });
    }
  }

  validarFormularios(){
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

  validarStock($event: any){
    if ($event.target.value > this.stockProducto) {
      
      //this.productosForm.get('cantidadProducto')?.setValue(this.stockProducto);
      console.log("el stock es ",this.stockProducto);
      this.productosForm.get('cantidadProducto')?.markAsTouched();
      this.productosForm.get('cantidadProducto')?.setErrors({ 'stockExcedido': true });
      this.hayStock = false;
      return;
    }else{
      this.productosForm.get('cantidadProducto')?.setErrors(null);
      this.hayStock = true;

    }

  }

}