import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfiguracionService } from 'src/app/services/domainServices/configuracion.service';

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

  constructor(private fb: FormBuilder) {}

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
      if (this.formulario.valid) {
        console.log(this.formulario.value);
      } else {
        console.log('Formulario no válido');
      }
    }
  
}