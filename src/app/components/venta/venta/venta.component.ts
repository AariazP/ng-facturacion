import { Component, Directive, DoCheck, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cantidadMayorQueCero } from 'src/app/validators/validatorFn';
import { CrearVentaDTO } from 'src/app/dto/venta/CrearVentaDTO';
import { ProductoDTO } from 'src/app/dto/producto/ProductoDTO';
import { ClienteDTO } from 'src/app/dto/cliente/ClienteDTO';
import { ProductoService } from 'src/app/services/domainServices/producto.service';
import { VentaService } from 'src/app/services/domainServices/venta.service';
import { MenuComponent } from '../../menu/menu.component';
import { ClienteService } from 'src/app/services/domainServices/cliente.service';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements DoCheck {

  protected clientes: ClienteDTO[];
  protected productos: ProductoDTO[];
  protected clienteSeleccionado!: ClienteDTO | null;
  protected productoSeleccionado!: ProductoDTO | null;
  protected formulario!: FormGroup;
  protected productosForm!: FormGroup;
  protected listProductos: ProductoDTO[];
  protected modoOculto: boolean = true;
  protected subtotal: number = 0;
  protected porcentajeIva: number = 19;
  protected igv: number = 0;
  protected stockProducto: number;
  protected hayStock = true;
  protected total = 0;
  protected productosFiltrados: ProductoDTO[] = [];
  protected clientesFiltrados: ClienteDTO[] = [];
  private formBuilder: FormBuilder = inject(FormBuilder);
  private clienteService: ClienteService = inject(ClienteService);
  private productoService: ProductoService = inject(ProductoService);
  private ventaService: VentaService = inject(VentaService);
  private menuComponent: MenuComponent = inject(MenuComponent);

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
    this.listarClientes();
  }

  /**
   * Este metodo se encarga de construir los formularios de la vista
   */
  private buildForms() {
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

  /**
   * Este metodo se encarga de enviar el formulario de la vista
   */
  onSubmit() {
    if (!this.validarFormulario()) return;
    const venta = this.crearVentaDTO();
    if (!this.validarProductosVenta(venta)) return;
    this.procesarVenta(venta);
  }
  /**
   * Este metodo se encarga de validar si los campos del formulario están completos
   * @returns 
   */
  private validarFormulario(): boolean {
    if (!this.formulario.valid) {
      this.formulario.markAllAsTouched();
      return false;
    }
    this.validarFormularios();
    return true;
  }

/**
 * Este método se encarga de listar todos los productos disponibles en la base de datos,
 * haciendo solicitudes hasta que no se reciban más productos.
 */
protected listarProductos(): void {
  let page = 0; 
  this.productos = []; 

  const obtenerProductosRecursivamente = (paginaActual: number): void => {
    this.productoService.getProductos(paginaActual).subscribe({
      next: (data) => {
        // Si hay productos en la página actual, se agregan a la lista de productos
        if (data.content.length > 0) {
          this.productos = [...this.productos, ...data.content];
          obtenerProductosRecursivamente(paginaActual + 1); // Llama a la siguiente página
        } else {
          console.log('Todos los productos han sido cargados:', this.productos.length);
        }
      },
      error: (err) => {
        console.error('Error al listar productos:', err);
      }
    });
  };

  // Comienza a obtener productos desde la primera página
  obtenerProductosRecursivamente(page);
}


/**
 * Este método se encarga de listar todos los clientes disponibles en la base de datos,
 * haciendo solicitudes hasta que no se reciban más productos.
 */
protected listarClientes(): void {
  let page = 0; 
  this.clientes = []; 

  const obtenerClientesRecursivamente = (paginaActual: number): void => {
    this.clienteService.getClientes(paginaActual).subscribe({
      next: (data) => {
        // Si hay productos en la página actual, se agregan a la lista de productos
        if (data.content.length > 0) {
          this.clientes = [...this.clientes, ...data.content];
          obtenerClientesRecursivamente(paginaActual + 1); // Llama a la siguiente página
        } else {
          console.log('Todos los clientes han sido cargados:', this.clientes.length);
        }
      },
      error: (err) => {
        console.error('Error al listar clientes:', err);
      }
    });
  };

  // Comienza a obtener productos desde la primera página
  obtenerClientesRecursivamente(page);
}

  /**
   * Este metodo devuelve un objeto de tipo CrearVentaDTO con los datos del formulario
   * @returns 
   */
  private crearVentaDTO(): CrearVentaDTO {
    let venta = new CrearVentaDTO();
    venta.cliente = this.formulario.get('cliente')!.value;
    venta.usuario = Number(localStorage.getItem('id'));
    return venta
  }

  /**
   * Este metodo se encarga de validar si los productos de la venta están en la base de datos
   * @param venta 
   * @returns 
   */
  private validarProductosVenta(venta: CrearVentaDTO): boolean {
    return this.ventaService.agregarProductosVenta(venta, this.listProductos);
  }

  /**
   * Este metodo se encarga de guardar la venta en la base de datos
   * @param venta 
   */
  private procesarVenta(venta: CrearVentaDTO): void {
    this.calcularValores();
    this.ventaService.crearVenta(venta, this.total).then(() => {
    this.finalizarVenta()});
  }
  
  /**
   * Este metodo limpia los campos del formulario y genera un nuevo id de factura
   */
  private finalizarVenta(): void {
    this.formulario.reset();
    this.generarIdFactura();
    this.clienteSeleccionado = null;
    this.resetListProductos();
  }

  /**
   * Este metodo limpia la lista de productos y los valores de la factura
   */
  private resetListProductos(): void {
    this.listProductos = [];
    this.subtotal = 0;
    this.igv = 0;
    this.total = 0;
  }

  /**
   * Este metodo se encarga de obtener el id de la factura
   */
  protected generarIdFactura():void {
    this.ventaService.generarIdVenta().subscribe(
      (resp: number) => {
        this.formulario.patchValue({
          numFactura: resp
        })
      }
    )
  }
  /**
   * Este metodo se encarga de seleccionar un cliente de la lista de clientes de la base de datos
   */
  protected seleccionarCliente(): void {
    let cedula = this.formulario.get('cliente')!.value;

    if (cedula == '') {
      this.formulario.reset();
      this.generarIdFactura();
    }

    this.ventaService.obtenerCliente(cedula).subscribe(
      response => {
        this.formulario.patchValue({
          nombre: response?.nombre,
          direccion: response?.direccion,
          correo: response?.correo
        });
      }
    )
  }
  /**
   * Este metodo se encarga de cambiar el modo de visualización de la vista
   */
  protected cambiarModoOculto():void {
    this.modoOculto = !this.modoOculto;
  }
  /**
   * Este metodo se encarga de agregar un producto a la lista de productos de la factura
   * y calcular el subtotal, igv y total de la factura
   * @returns 
   */
  public async agregarProducto(): Promise<void> {
    if (!this.productosForm.valid) {
        Object.values(this.productosForm.controls).forEach(control => control.markAsTouched());
        return;
    }

    const cantidad = +this.productosForm.get('cantidadProducto')?.value;
    const codigo = this.productosForm.get('codigoProducto')?.value;

    try {
        const productoActivo = await this.productoService.verificarProductoActivo(codigo);
        const cantidadValida = await this.productoService.verificarProductoCantidad(cantidad, codigo);

        if (!productoActivo || !cantidadValida) {
            this.hayStock = false;
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
        this.subtotal = this.listProductos.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
        this.calcularValores();
    } catch (error) {
        console.error(error);
    }
}


  /**
   * Este metodo se encarga de resetear los campos del formulario de productos
   * y el producto seleccionado
   */
  private resetForms():void {
    this.productosForm.reset();
    this.productoSeleccionado = null;
    this.productosForm.get('cantidadProducto')?.setValue(1);
  }

  /**
   * Este metodo se encarga de calcular el subtotal, igv y total de la factura
   */
  private calcularValores():void {
    this.subtotal = this.listProductos.reduce((total: number, producto: ProductoDTO) => total + (producto.precio * producto.cantidad), 0);
    this.igv = this.subtotal * (this.porcentajeIva / 100);
    this.total = this.subtotal;
  }

  /**
   * Este metodo se encarga de eliminar un producto de la lista de productos de la factura
   * @param producto Producto a eliminar
   */
  protected eliminarPorId(producto: ProductoDTO): void {
    const indice = this.listProductos.indexOf(producto);
    if (indice !== -1) {
      this.listProductos.splice(indice, 1);
      this.calcularValores();
    }
  }
  
  /**
   * Este metodo se encarga de seleccionar un producto de la lista de productos
   * cuando se ingresa un codigo de producto en el formulario
   * Asigna los atributos del producto seleccionado a los campos del formulario
   * @returns void
   */
  protected seleccionarProducto(): void {
    const idProducto = this.productosForm.get('codigoProducto')?.value;
    if (!idProducto || idProducto.trim() === '') {
      this.productosForm.reset();
      this.productoSeleccionado = null;
      return;
    }
    this.productoService.obtenerProductoPorCodigo(idProducto).subscribe(
      producto => this.asignarProducto(producto)
    );
    
  }

  /**
   * Este metodo se encarga de asignar un producto a la variable productoSeleccionado
   * @param producto El producto a asignar
   * @returns void
   */
  asignarProducto(producto: ProductoDTO): void {
    
    if (!producto) {
      this.productosForm.get('codigoProducto')?.setErrors({ productoNoEncontrado: true });
      this.productoSeleccionado = null
      return;
    }
    this.stockProducto = producto.cantidad;
    this.productoSeleccionado = producto;
    this.productosForm.patchValue({
      nombreProducto: producto.nombre,
      precioProducto: producto.precio
    });
  }

    /**
   * Este metodo se encarga de asignar un cliente a la variable clienteSeleccionado
   * @param cliente El producto a asignar
   * @returns void
   */
    asignarCliente(cliente: ClienteDTO): void {
    
      if (!cliente) {
        this.formulario.get('cedulaCliente')?.setErrors({ clienteNoEncontrado: true });
        this.clienteSeleccionado = null
        return;
      }
      this.clienteSeleccionado = cliente;
      this.formulario.patchValue({
        nombre: cliente.nombre,
        direccion: cliente.direccion
      });
    }

  /**
   * Este metodo se encarga de validar los campos del formulario
   * y asignar los valores de los campos al formulario
   */
  private validarFormularios():void {
    // Validar cliente
    this.actualizarFormulario(
      this.formulario,
      this.clienteSeleccionado,
      {
        ruc: 'rucDni',
        razonSocial: 'nombre',
        correo: 'correo',
      },
      ['ruc', 'razonSocial', 'correo']
    );

    // Validar producto
    this.actualizarFormulario(
      this.productosForm,
      this.productoSeleccionado,
      {
        nombreProducto: 'nombre',
        precioProducto: 'precio',
      },
      ['nombreProducto', 'precioProducto']
    );
  }

  /**
   * Actualiza los valores de un formulario reactivo y valida los campos.
   * @param formulario El formulario a actualizar.
   * @param objetoSeleccionado El objeto con los datos seleccionados (puede ser nulo).
   * @param camposMap Un mapeo entre los campos del formulario y las propiedades del objeto.
   * @param camposValidar Una lista de nombres de campos que deben ser validados si no hay objeto seleccionado.
   */
  private actualizarFormulario(
    formulario: FormGroup,
    objetoSeleccionado: any | null,
    camposMap: { [key: string]: string },
    camposValidar: string[]
  ):void {
    if (objetoSeleccionado) {
      // Actualizar los campos con los valores del objeto seleccionado
      const valores = Object.keys(camposMap).reduce((acc, key) => {
        acc[key] = objetoSeleccionado[camposMap[key]] || '';
        return acc;
      }, {} as { [key: string]: any });
      formulario.patchValue(valores);
    } else {
      // Vaciar los campos y añadir validaciones si no hay objeto seleccionado
      const valores = Object.keys(camposMap).reduce((acc, key) => {
        acc[key] = '';
        return acc;
      }, {} as { [key: string]: any });
      formulario.patchValue(valores);

      camposValidar.forEach(campo => {
        formulario.get(campo)?.setValidators(Validators.required);
      });
    }

    // Actualizar el estado de validación de los campos
    camposValidar.forEach(campo => {
      formulario.get(campo)?.updateValueAndValidity();
    });
  } 


  /**
   * Este método se encarga de cerrar el menu y asi
   * evita que se genere un bug con la ventana emergente
   */
  cerrarMenu() {
    if (!this.menuComponent.estadoMenu){
      this.menuComponent.toggleCollapse();
    }
  }

/**
 * Filtra los productos según el texto ingresado en el campo 'codigoProducto'.
 */
protected filtrarProductos(): void {
  const idProducto = this.productosForm.get('codigoProducto')?.value?.toLowerCase() || '';
  if (idProducto.trim() === '') {
    this.productosFiltrados = [];
    return;
  }
  this.productosFiltrados = this.productos.filter(producto => 
    producto.codigo.toLowerCase().includes(idProducto) || producto.nombre.toLowerCase().includes(idProducto)
  );
}

/**
 * Filtra los clientes según el texto ingresado en el campo 'cedulaCliente'.
 */
protected filtrarClientes(): void {
  const ccCliente = this.formulario.get('cliente')?.value?.toLowerCase() || '';
  if (ccCliente.trim() === '') {
    this.clientesFiltrados = [];
    return;
  }
  this.clientesFiltrados = this.clientes.filter(cliente => 
    cliente.cedula.toLowerCase().includes(ccCliente) || cliente.nombre.toLowerCase().includes(ccCliente)
  );

}


/**
 * Oculta las sugerencias al perder el foco del campo.
 */
protected ocultarSugerencias(): void {
    this.productosFiltrados = [];
    this.clientesFiltrados = [];
}

/**
 * Maneja la selección de un producto desde la lista de sugerencias.
 * @param producto Producto seleccionado.
 */
protected seleccionarProductoDeLista(producto: ProductoDTO): void {
  this.productosForm.patchValue({
    codigoProducto: producto.codigo,
  });
  this.ocultarSugerencias();
  this.asignarProducto(producto);
}

/**
 * Maneja la selección de un cliente desde la lista de sugerencias.
 * @param cliente Cliente seleccionado.
 */
protected seleccionarClienteDeLista(cliente: ClienteDTO): void {
  this.formulario.patchValue({
    cliente: cliente.cedula,
  });
  this.ocultarSugerencias();
  this.asignarCliente(cliente);
}

/**
 * Dependiendo si hay algun cambio en la base de datos 
 * este metodo actualiza la listaProductos en localStorage
 */
protected actualizarListaProductos(): void {
  /**const listaProductos = JSON.parse(localStorage.getItem('listaProductos'));
  if (listaProductos) {
    this.productos = listaProductos;
    }
  }**/

}
}