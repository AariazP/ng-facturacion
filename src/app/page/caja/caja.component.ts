import { Component } from '@angular/core';

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

  ngOnInit() {
    this.cargarDatos();
    this.actualizarTotalEfectivo();
  }

  mostrarModal(action: 'ingreso' | 'egreso') {
    this.currentAction = action;
    this.modalTitle = action === 'ingreso' ? 'Ingreso de Valor' : 'Egreso de Valor';
    this.actionButtonText = action === 'ingreso' ? 'Guardar' : 'Registrar Egreso';
    const modal = document.getElementById('ingresoModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  ocultarModal() {
    const modal = document.getElementById('ingresoModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  procesarTransaccion() {
    const valorInput = (<HTMLInputElement>document.getElementById('valor')).value;
    const motivoInput = (<HTMLTextAreaElement>document.getElementById('motivo')).value;
    const valor = parseFloat(valorInput);

    if (!isNaN(valor)) {
      if (this.currentAction === 'ingreso') {
        this.ingresos += valor;
        this.movimientos.push({ motivo: motivoInput, valor, tipo: 'Ingreso' });
      } else {
        this.egresos += valor;
        this.movimientos.push({ motivo: motivoInput, valor, tipo: 'Egreso' });
      }
      this.actualizarTotalEfectivo();
      this.guardarDatos();
      console.log(`Valor ${this.currentAction === 'ingreso' ? 'ingresado' : 'egresado'}: ${valor}, Motivo: ${motivoInput}`);
      this.ocultarModal(); // Oculta el modal después de guardar
    } else {
      alert('Por favor, ingrese un valor válido.');
    }
  }

  actualizarTotalEfectivo() {
    this.totalEfectivo = this.totalVentas + this.ingresos - this.egresos;
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
}
