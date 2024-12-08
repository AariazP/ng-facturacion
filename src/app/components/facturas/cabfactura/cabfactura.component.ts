import { Component, DoCheck, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrearVentaDTO } from 'src/app/dto/venta/CrearVentaDTO';
import { HttpClientesService } from 'src/app/http-services/httpClientes.service';
import { HttpFacturasService } from 'src/app/http-services/httpFacturas.service';
import { HttpProductoService } from 'src/app/http-services/httpProductos.service';
import { AlertService } from 'src/app/utils/alert.service';
import { cantidadMayorQueCero, soloTexto, validarDecimalConDosDecimales } from 'src/app/validators/validatorFn';
import { jsPDF } from 'jspdf';
import { DetalleVentaDTO } from 'src/app/dto/detalleVenta/DetalleVentaDTO';

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
              private httpClienteComponent: HttpClientesService,
              private httpFacturasService: HttpFacturasService, 
              private httpProductoService: HttpProductoService,
              private alert : AlertService,
              private httpClienteService: HttpClientesService
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

  async onSubmit() {

    if (!this.formulario.valid ) {
      this.formulario.markAllAsTouched();
      return;
    }
    
    let totalPagar = this.total;
    console.log('total' + totalPagar );
    
    await this.alert.simpleInputAlert().then((result) => {
      let dinero = 0;
      
      if(result == null || result == undefined){
        this.alert.simpleErrorAlert('No se ha ingresado un valor');
        return;
      }


      if (isNaN(Number(result))) {
        this.alert.simpleErrorAlert('El valor ingresado no es un número');
        return;
      }
      console.log('result' + result);
      if (result) {
        dinero = Number(result);
      }
      if (dinero < this.total) {
        this.alert.simpleErrorAlert('El dinero ingresado es menor al total de la factura');
        return;
      }

      let factura = new CrearVentaDTO();
     factura.cliente = this.formulario.get('cliente')!.value;

    this.httpClienteComponent.verificarExistencia(factura.cliente).subscribe(
      response => {
        if(!response){
          this.alert.simpleErrorAlert('El cliente con esa cedula no se ha encontrado');
          return;
        }
      });


    factura.usuario = Number(localStorage.getItem('id'));
   
    if(this.listProductos.length == 0){
      this.alert.simpleErrorAlert('No se ha agregado ningun producto a la factura');
      return;
    }

    this.listProductos.map(producto => {
      let detalleFactura =  new DetalleVentaDTO();
      detalleFactura.cantidad = producto.cantidadProducto;
      detalleFactura.codProducto = producto.codProducto
      factura.agregarDetalle(detalleFactura);
    });

  
    
    this.httpFacturasService.guardarFactura(factura).subscribe(
      (resp: any) => {
        setTimeout(() => {
          console.log(dinero);
          this.alert.simpleSuccessAlert('El cambio es: ' + (dinero-totalPagar));
        }, 300);
        this.alert.simpleSuccessAlert('Factura guardada correctamente');
            // Llamar al método imprimirFactura() después de guardar la factura
    this.imprimirFactura();
      },
      error => {
        this.alert.simpleErrorAlert(error.error.mensaje);
      }
    )


    
    this.formulario.reset();
    this.generarFactura();
    this.clienteSeleccionado = null;
    this.resetListProductos();

    });
     
  }

  resetListProductos(): void {
    this.listProductos = [];
    this.subtotal = 0;
    this.igv = 0;
    this.total = 0;
  }

  generarFactura(){
    this.httpFacturasService.generaFactura().subscribe(
      (resp: any) => {
        this.formulario.patchValue({
          numFactura: resp
        })
      }
    )
  }

  imprimirFactura() {
    const doc = new jsPDF();
  
    // Establecer el tamaño de fuente
    doc.setFontSize(12);
  
    // Añadir contenido de la factura, como la información del cliente
    doc.text('Factura de Venta', 10, 10);
    doc.text('Fecha: ' + new Date().toLocaleDateString(), 10, 40);
  
    // Espacio entre la información del cliente y los productos
    let startY = 50; // Posición Y inicial donde comenzarán los productos
  
    // Recorrer la lista de productos y agregarlos al PDF
    this.listProductos.forEach((producto: any, index: number) => {
      const productoY = startY + (index * 10); // Aumenta la posición Y para cada producto
  
      // Agregar el nombre, cantidad y precio de cada producto al PDF
      doc.text(`${producto.nombreProducto} - Cantidad: ${producto.cantidad} - Precio: ${producto.precio.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`, 10, productoY);
    });
  
    // Descargar el PDF con un nombre dinámico basado en el cliente
    doc.save(`Factura.pdf`);
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
      this.generarFactura();
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

  buscarCliente(){

  }


}