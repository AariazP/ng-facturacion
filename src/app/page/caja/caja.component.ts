import { Component } from '@angular/core';
import { MenuComponent } from 'src/app/components/menu/menu.component';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css']
})
export class CajaComponent {
  totalVentas: number = 0;
  totalExterno: number = 0;
  totalEfectivo: number = 0;
  ingresos: number = 0;
  egresos: number = 0;
  movimientos: Array<{ motivo: string, valor: number, tipo: string }> = [];
  modalTitle: string = '';
  actionButtonText: string = '';
  currentAction: 'ingreso' | 'egreso' = 'ingreso';

  valorFormateado: string = ''; // Para almacenar el valor con formato
  

  constructor(private menuComponent: MenuComponent) {}

  formatearValor(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valorSinFormato = input.value.replace(/[^\d]/g, ''); // Elimina caracteres no numéricos
    const valorNumerico = parseInt(valorSinFormato, 10);

    if (!isNaN(valorNumerico)) {
      this.valorFormateado = valorNumerico.toLocaleString('en-US'); // Formato con comas
      input.value = this.valorFormateado;
    } else {
      this.valorFormateado = '';
    }
  }

  triggerToggleCollapse() {
    if (!this.menuComponent.estadoMenu){
      this.menuComponent.toggleCollapse();
    }
    console.log('el menu esta', this.menuComponent.estadoMenu);
  }

  ngOnInit() {
    this.cargarDatos();
    this.actualizarTotalEfectivo();
  }

  mostrarModal(action: 'ingreso' | 'egreso') {
    this.limpiarCampos(); // Limpia los campos antes de mostrar el modal
    this.currentAction = action;
    this.modalTitle = action === 'ingreso' ? 'Ingreso de Valor' : 'Egreso de Valor';
    this.actionButtonText = action === 'ingreso' ? 'Registrar Ingreso' : 'Registrar Egreso';
    const modal = document.getElementById('ingresoModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  limpiarCampos() {
    this.valorFormateado = ''; // Resetea el valor formateado
    const motivoInput = <HTMLTextAreaElement>document.getElementById('motivo');
    if (motivoInput) {
      motivoInput.value = ''; // Resetea el valor del textarea
    }
  }

  ocultarModal() {
    const modal = document.getElementById('ingresoModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  procesarTransaccion() {
    const valorNumerico = parseFloat(this.valorFormateado.replace(/,/g, '')); // Convierte a número real
    const motivoInput = (<HTMLTextAreaElement>document.getElementById('motivo')).value;

    if (!isNaN(valorNumerico)) {
      if (this.currentAction === 'ingreso') {
        this.ingresos += valorNumerico;
        this.movimientos.push({ motivo: motivoInput, valor: valorNumerico, tipo: 'Ingreso' });
      } else {
        this.egresos += valorNumerico;
        this.movimientos.push({ motivo: motivoInput, valor: valorNumerico, tipo: 'Egreso' });
      }
      this.actualizarTotalEfectivo();
      this.guardarDatos();
      console.log(`Valor ${this.currentAction === 'ingreso' ? 'ingresado' : 'egresado'}: ${valorNumerico}, Motivo: ${motivoInput}`);
      this.ocultarModal(); // Oculta el modal después de guardar
    } else {
      alert('Por favor, ingrese un valor válido.');
    }
  }

  actualizarTotalEfectivo() {
    this.totalEfectivo = this.totalVentas + this.ingresos - this.egresos;
    this.totalExterno = this.ingresos - this.egresos;
  }

  guardarDatos() {
    localStorage.setItem('totalVentas', this.totalVentas.toString());
    localStorage.setItem('totalExterno', this.totalExterno.toString());
    localStorage.setItem('totalEfectivo', this.totalEfectivo.toString());
    localStorage.setItem('ingresos', this.ingresos.toString());
    localStorage.setItem('egresos', this.egresos.toString());
    localStorage.setItem('movimientos', JSON.stringify(this.movimientos));
  }

  cargarDatos() {
    this.totalVentas = parseFloat(localStorage.getItem('totalVentas') || '0');
    this.totalExterno = parseFloat(localStorage.getItem('totalExterno') || '0');
    this.totalEfectivo = parseFloat(localStorage.getItem('totalEfectivo') || '0');
    this.ingresos = parseFloat(localStorage.getItem('ingresos') || '0');
    this.egresos = parseFloat(localStorage.getItem('egresos') || '0');
    this.movimientos = JSON.parse(localStorage.getItem('movimientos') || '[]');
  }

  limpiarDatos() {
    localStorage.removeItem('totalVentas');
    localStorage.removeItem('totalExterno');
    localStorage.removeItem('totalEfectivo');
    localStorage.removeItem('ingresos');
    localStorage.removeItem('egresos');
    localStorage.removeItem('movimientos');
    this.totalVentas = 0;
    this.totalExterno = 0;
    this.totalEfectivo = 0;
    this.ingresos = 0;
    this.egresos = 0;
    this.movimientos = [];
    console.log('Datos limpiados');
  }
}