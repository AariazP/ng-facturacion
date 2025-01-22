import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/app/env/env';
import { ConfiguracionService } from 'src/app/services/domainServices/configuracion.service';
import { AlertService } from 'src/app/utils/alert.service';

@Component({
  selector: 'app-facturacion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {

  placeholders: { [key: string]: string } = {};
  protected formulario!: FormGroup;
  private IVA!: string | number;
  private NIT!: string | number;
  private nombreNegocio!: string | number;
  private direccionNegocio!: string | number;
  private gerenteNegocio!: string | number;
  private fechaExpedicion!: string | number;
  private telefonos!: string | number;
  private resolucionDian!: string | number;
  private correo!: string | number;
  private configuracionService: ConfiguracionService = inject(ConfiguracionService);
  private alertService: AlertService = inject(AlertService);

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();  // Crear el formulario
    this.getData();     // Obtener los datos del servicio
  }

  // Crear el formulario
  createForm(): void {
    this.formulario = this.fb.group({
      razonSocial: ['', Validators.required],
      nit: ['', Validators.required],
      resolucionDIAN: ['', Validators.required],
      fechaExpedicionDIAN: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]],
      iva: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  getData() {
    try {
      this.gerenteNegocio = this.configuracionService.getVariable('gerenteNegocio');
      this.nombreNegocio = this.configuracionService.getVariable('nombreNegocio');
      this.direccionNegocio = this.configuracionService.getVariable('direccionNegocio');
      this.fechaExpedicion = this.configuracionService.getVariable('fechaExpedicion');
      this.telefonos = this.configuracionService.getVariable('telefonos');
      this.resolucionDian = this.configuracionService.getVariable('resolucionDian');
      this.IVA = this.configuracionService.getVariable('IVA');
      this.NIT = this.configuracionService.getVariable('nit');
      this.correo = this.configuracionService.getVariable('correo');

      // Inicialización de placeholders
      this.placeholders = {
        razonSocial: String(this.gerenteNegocio),
        nit: String(this.NIT),
        resolucionDIAN: String(this.resolucionDian),
        fechaExpedicionDIAN: String(this.fechaExpedicion),
        direccion: String(this.direccionNegocio),
        telefono: String(this.telefonos),
        correoElectronico: String(this.correo),
        iva: String(this.IVA)
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      } else {
        console.error('Error desconocido:', error);
      }
    }
  }

  onSubmit(): void {
    const valoresActuales = this.formulario.value;
  
    // Mapa entre las claves del formulario y las claves del environment
    const keyMap: { [key: string]: keyof typeof environment } = {
      razonSocial: 'gerenteNegocio',
      nit: 'nit',
      resolucionDIAN: 'resolucionDian',
      fechaExpedicionDIAN: 'fechaExpedicion',
      direccion: 'direccionNegocio',
      telefono: 'telefonos',
      correoElectronico: 'correo',
      iva: 'IVA',
    };
  
    for (const key in valoresActuales) {
      if (valoresActuales.hasOwnProperty(key)) {
        const control = this.formulario.get(key);
  
        // Verificar si el valor cambió, es válido, y la clave está en el mapa
        if (
          String(valoresActuales[key]) !== this.placeholders[key] && // Cambió
          control && // Existe el control
          control.valid && // Es válido
          keyMap[key] // Existe en el mapa
        ) {
          try {
            // Llamar al método setVariable del servicio
            this.configuracionService.setVariable(
              keyMap[key], // Clave traducida
              valoresActuales[key] // Nuevo valor
            );
            this.alertService.simpleSuccessAlert(`"${key}" actualizado correctamente`);
          } catch (error) {
            console.error(`Error al actualizar "${key}": ${error}`);
          }
        }
      }
    }
  }

}