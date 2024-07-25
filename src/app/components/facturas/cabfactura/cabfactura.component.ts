import { Component, DoCheck, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs';
import { ClienteComponent } from 'src/app/page/cliente/cliente.component';
import { ClientesService } from 'src/app/service/clientes.service';
import { FacturasService } from 'src/app/service/facturas.service';
import { ProductoService } from 'src/app/service/productos.service';
import { AlertService } from 'src/app/utils/alert.service';
import { cantidadMayorQueCero, soloTexto, validarDecimalConDosDecimales } from 'src/app/validators/validatorFn';

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
  formulario: FormGroup;
  productosForm!: FormGroup;
  listProductos: any[] = [];
  modoOculto: boolean = true;

  subtotal: number = 0;
  porcentajeIva: number = 19;
  igv: number = 0;
  total: number = 0;
  stockProducto = '';
  hayStock = true;
  constructor(
              private formBuilder: FormBuilder, 
              private clienteComponent: ClientesService, 
              private facturasService: FacturasService, 
              private productoService: ProductoService,
              private alert : AlertService,
              private clienteService: ClientesService
              ) {

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

  ngDoCheck() {
    this.validarFormularios();
  }
  
  
  ngOnInit(){
    this.generarFactura();
  }

  onSubmit() {

    if (this.formulario.valid ) {
      console.log('El formulario es válido. Enviar solicitud...');
    } else {
      this.formulario.markAllAsTouched();
      return;
    }
 

    console.log('Etrasssx...');

    this.formulario.patchValue({
      ruc: this.clienteSeleccionado.rucDni,
      razonSocial: this.clienteSeleccionado.nombre,
      correo: this.clienteSeleccionado.correo
    });

    const datosEnviar = {
      "numeroFactura": this.formulario.value.numFactura,
      "rucCliente": this.formulario.value.ruc,
      "subtotal": this.subtotal,
      "igv": this.igv,
      "total": this.total
    };
    console.log("Datos a enviar", datosEnviar)

    this.facturasService.guardarCabecera(datosEnviar)
    .pipe(
      switchMap( (respuesta: any) => {
      console.log(this.listProductos)
      const productosParaGuardar = this.listProductos.map(producto => {
        return {
          codigoProducto: producto.codProducto,
          cantidad: producto.cantidadProducto,
          pkCabFactura: respuesta.idFcatura,
        };
      });
      return this.facturasService.guardarDetalles(productosParaGuardar);
      }),
      switchMap((responseDetalles: any) => {
        const productosDisminuirStock = this.listProductos.map(producto => {
          return {
            "codigoProducto": producto.codProducto,
            "cantidad": producto.cantidadProducto
          };
        });
        console.log("stock a disminuir", productosDisminuirStock)
        return this.productoService.disminuirStock(productosDisminuirStock);
      })
      
      )
    .subscribe(response => {
      console.log('Datos enviados correctamente:', response);
      alert('Datos registrados correctamente');
      this.formulario.reset();
      this.generarFactura();
      this.clienteSeleccionado = null;
      this.resetListProductos();
    }, error => {
      console.error('Error al enviar datos:', error);
      alert('Error al enviar datos: los campos no cumplen con los formatos requeridos');	
    });
  }

  resetListProductos(): void {
    this.listProductos = [];
    this.subtotal = 0;
    this.igv = 0;
    this.total = 0;
  }

  generarFactura(){
    this.facturasService.generaFactura().subscribe(
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
    this.clienteComponent.getData().subscribe(data => {
      this.clientes = data;
    })
  }

  seleccionarCliente(): void{
    let cedula = this.formulario.get('cliente')!.value;

    if(cedula == ''){ 
      this.formulario.reset();
      this.generarFactura();
    }


    this.clienteService.obtenerCliente(cedula).subscribe(
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

    this.productoService.verificarActivo(codigo).subscribe(
      (response) => {
        if (!response) {
          this.alert.simpleErrorAlert('El producto no está activo');
          return;
        }
      }
    )

    this.productoService.verificarCantidad(cantidad, codigo).subscribe(
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
    this.productoService.getData().subscribe(data => {
      this.productos = data;
    })
  }
  seleccionarProducto(): void{
    let idProducto = this.productosForm.get('codProducto')?.value
    this.productoSeleccionado = this.productos.find( producto => producto.codigo == idProducto);
    if(this.productoSeleccionado != null && this.productoSeleccionado != undefined){
      this.stockProducto = this.productoSeleccionado.stock;
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

  buscarCliente(){

  }


}
