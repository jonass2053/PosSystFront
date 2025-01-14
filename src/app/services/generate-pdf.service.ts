import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AlertServiceService } from '../components/utilities/alert-service.service';

@Injectable({
  providedIn: 'root'
})
export class GeneratePDFService {

  constructor(
    private alertas : AlertServiceService
  ) { }
  idFactura! : number;
   /**
   * Genera un PDF a partir de un elemento HTML.
   * @param elementId ID del elemento HTML a capturar.
   * @param fileName Nombre del archivo PDF a generar.
   */
   generatePDF(elementId: string, fileName: string = 'document.pdf'): void {
   this.alertas.ShowLoading();
    const element = document.getElementById(elementId) as HTMLElement;
    console.log(element)

    if (!element) {
      console.error(`Elemento no encontrado: #${elementId}`);
      return;
    }

    html2canvas(element, { scale: 3, useCORS: true }).then(canvas => {
      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'letter' });
      const imgData = canvas.toDataURL('image/png');

      // Dimensiones en mm para tamaño carta
      const pageWidth = 216;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
      this.alertas.hideLoading();
      // Abrir el PDF en una nueva ventana
      window.open(URL.createObjectURL(pdf.output('blob')), '_blank');
    }).catch(error => {
      console.error('Error generando el PDF:', error);
    });
}
}
