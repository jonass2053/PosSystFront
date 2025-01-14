import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxPrintService, PrintOptions } from 'ngx-print';
import { FacturaService } from '../../services/factura.service';
import { iFactura, iMoneda } from '../../interfaces/iTermino';
import { parse } from 'path';
import { importaciones } from '../../components/utilities/material/material';
import { AlertServiceService } from '../../components/utilities/alert-service.service';
import { UsuarioService } from '../../services/usuario.service';
import { GeneratePDFService } from '../../services/generate-pdf.service';
import { MatDialogRef } from '@angular/material/dialog';
import { InformationService } from '../../services/information.service';

@Component({
  selector: 'app-factura-report',
  standalone: true,
  imports: [importaciones],
  templateUrl: './factura-report.component.html',
  styleUrl: './factura-report.component.css'
})
export class FacturaReportComponent {
  
  constructor(
    private printService: NgxPrintService,
    private router : Router,
    private facturaService : FacturaService,
    private route: ActivatedRoute,
    private alertService : AlertServiceService,
    private usuarioService : UsuarioService,
    private reportService : GeneratePDFService,
    private informationService : InformationService,
    public dialogRef: MatDialogRef<FacturaReportComponent>
  
  ){
    this.moneda = this.usuarioService.usuarioLogueado.data.sucursal.empresa.moneda; 
    this.facturaForPrint = facturaService.facturaEdit;
    this.tipoDocument = this.informationService.tipoDocumento;

  }
  ngAfterViewInit(){
    setTimeout(() => {
      this.reportService.generatePDF('print-section', 'mi-documento.pdf');
      setTimeout(() => {
        this.dialogRef.close();
      }, 50);
    }, 200);
  }
  id! : number; 
  factura! : iFactura;
  facturaForPrint: any;
  moneda!: iMoneda;
  tipoDocument :  string='';




  printFactura(){ 
    const customPrintOptions: PrintOptions = new PrintOptions({
      printSectionId: 'print-section',
      printTitle: "Factura",
      useExistingCss: true,
      openNewTab: false,
      previewOnly: false,
      closeWindow: true,
      printDelay: 5
  });
  //  this.printService.print(customPrintOptions)

  //  this.router.navigateByUrl("layout/facturas")
  }

}