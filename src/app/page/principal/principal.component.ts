import { Component } from '@angular/core';
import { CardComponent } from 'src/app/components/card/card.component'; 
import { environment } from 'src/app/env/env';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent {
  cards = [
    {
      title: 'Vender',
      description: 'Aquí puede realizar una venta directa, relacionando un cliente con un producto específico.',
      imageSrc: 'https://img.icons8.com/3d-fluency/94/receive-cash.png',
      imageAlt: 'receive-cash',
      link: '/app/venta'
    },
    {
      title: 'Ver inventario',
      description: 'Aquí puede gestionar a detalle toda la informacion relacionada con los productos.',
      imageSrc: 'https://img.icons8.com/fluency/96/warehouse-1.png',
      imageAlt: 'warehouse-1',
      link: '/app/producto'
    },
    {
      title: 'Mis clientes',
      description: 'Aquí puede gestionar y ver a detalle toda la informacion relacionada con los clientes.',
      imageSrc: 'https://img.icons8.com/3d-fluency/94/conference-call--v2.png',
      imageAlt: 'conference-call--v2',
      link: '/app/cliente'
    },
    {
      title: 'Historial de ventas',
      description: 'Aquí puede gestionar y ver un historial detallado de todas las ventas que ha realizado.',
      imageSrc: 'https://img.icons8.com/fluency/96/financial-tasks.png',
      imageAlt: 'financial-tasks',
      link: '/app/lista-ventas'
    },
    {
      title: 'Caja',
      description: 'Tomar el control de los ingresos y egresos de la caja menor.',
      imageSrc: 'https://img.icons8.com/3d-fluency/94/cash-register.png',
      imageAlt: 'cash-register',
      link: '/app/caja'
    },
    {
      title: 'Configuración',
      description: 'En esta sección podrá editar cierta información del negocio',
      imageSrc: 'https://img.icons8.com/fluency/96/settings.png',
      imageAlt: 'settings',
      link: '/app/configuracion'
    },
    {
      title: 'Facturación Electrónica',
      description: 'Aquí podrá ver las facturas electrónicas que se han generado.',
      imageSrc: 'https://img.icons8.com/3d-fluency/94/receipt.png',
      imageAlt: 'receipt',
      link: '/app/facturacion-electronica'
    }
  ];

  public nombreNegocio: string = environment.nombreNegocio;
}
