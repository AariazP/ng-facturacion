import { Injectable } from "@angular/core";
import { FullVentaDTO } from "../dto/venta/FullVentaDTO";
import { ImprimirFacturaDTO } from "../dto/factura/ImprimirFacturaDTO";

@Injectable({
    providedIn: 'root'
})
export class FacturaService {

    /**
     * Este metodo se encarga de imprimir la factura de una venta
     * @param venta es la venta de la cual se va a imprimir la factura
     */
    public imprimirFactura(venta: FullVentaDTO) {
        let factura = ImprimirFacturaDTO.crearFactura(venta);
        this.generateInvoice(factura);
    }

    /**
    * Este método se encarga de generar e imprimir la factura en formato HTML. 
    * @param data Objeto de tipo ImprimirFacturaDTO que contiene la información necesaria para generar la factura,
    * incluyendo detalles del cliente, productos, totales y otros datos relevantes.
    */
    async generateInvoice(data: ImprimirFacturaDTO) {
        try {
            // Cargar el archivo HTML
            const facturaHTML = await this.loadHTMLTemplate('assets/factura.html');

            // Generar la factura con datos reemplazados
            const filledHTML = this.populateInvoiceTemplate(facturaHTML, data);

            // Abrir el HTML generado e imprimir
            this.openAndPrintHTML(filledHTML);
        } catch (error) {
            console.error('Error al generar la factura:', error);
        }
    }

    /**
     * Este método carga una plantilla HTML desde una ruta específica.
     * 
     * @param path Ruta relativa del archivo HTML a cargar.
     * @returns Una promesa que se resuelve con el contenido HTML como texto.
     * @throws Lanza un error si no se puede cargar la plantilla.
     */
    private async loadHTMLTemplate(path: string): Promise<string> {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`No se pudo cargar el archivo HTML: ${response.statusText}`);
        }
        return response.text();
    }

    /**
     * Este método reemplaza los marcadores de posición en la plantilla HTML con los datos proporcionados.
     * 
     * @param template Plantilla HTML en formato de texto con marcadores de posición.
     * @param data Objeto de tipo ImprimirFacturaDTO que contiene los datos para reemplazar.
     * @returns Un string con la plantilla HTML llena de los datos de la factura.
     */
    private populateInvoiceTemplate(template: string, data: ImprimirFacturaDTO): string {
        const formatoDinero = (value: number) =>
            new Intl.NumberFormat('es-CO', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
                useGrouping: true,
            }).format(value);

        // Generar filas de productos
        const productosHTML = data.productos
            .map(producto => `
            <tr>
                <td>${producto.producto}</td>
                <td>${producto.cantidad}</td>
                <td>${formatoDinero(producto.precio)}</td>
            </tr>
        `)
            .join('');

        // Reemplazar marcadores
        return template
            .replace('{{fechaVenta}}', data.fechaVenta)
            .replace('{{fecha}}', data.fecha)
            .replace('{{cliente}}', data.cliente)
            .replace('{{cc}}', data.cc)
            .replace('{{correo}}', data.correo)
            .replace('{{direccion}}', data.direccion)
            .replace('{{base}}', formatoDinero(data.base))
            .replace('{{iva}}', formatoDinero(data.iva))
            .replace('{{efectivo}}', formatoDinero(data.total))
            .replace('{{total}}', formatoDinero(data.total))
            .replace('{{cambio}}', formatoDinero(data.cambio))
            .replace('{{cufe}}', data.cufe)
            .replace('{{productos}}', productosHTML);
    }

    /**
     * Este método abre una nueva ventana en el navegador, escribe el contenido HTML
     * generado dentro de ella y lanza el comando de impresión.
     * 
     * @param html Contenido HTML de la factura que será impreso.
     * @throws Lanza un error si no se puede abrir la ventana de impresión.
     */
    private openAndPrintHTML(html: string): void {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            throw new Error('No se pudo abrir la ventana de impresión');
        }
        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.print();
    }


}