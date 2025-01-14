import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AlertServiceService } from '../../../../utilities/alert-service.service';
import { MsjService } from '../../../../utilities/msj.service';
import { UsuarioService } from '../../../../../services/usuario.service';
import { iFactura, iMoneda } from '../../../../../interfaces/iTermino';
import { FacturaService } from '../../../../../services/factura.service';
import { ServiceResponse } from '../../../../../interfaces/service-response-login';
import { importaciones } from '../../../../utilities/material/material';
import { routes } from '../../../layout.routes';
import { Router } from '@angular/router';
import {
  MatDialog,
} from '@angular/material/dialog';
import { PagoFacturaComponent } from '../pago-factura/pago-factura.component';
import { Overlay, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { PagosService } from '../../../../../services/pagos.service';
import printJS from 'print-js';
import es6printJS from "print-js";
import { NgxPrintService, PrintOptions } from 'ngx-print';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { GeneratePDFService } from '../../../../../services/generate-pdf.service';
import { FacturaReportComponent } from '../../../../../reports/factura-report/factura-report.component';
import { InformationService } from '../../../../../services/information.service';




@Component({
  selector: 'app-list-facturas',
  standalone: true,
  imports: [
    importaciones
  ],
  templateUrl: './list-facturas.component.html',
  styleUrl: './list-facturas.component.css'
})
export class ListFacturasComponent {
  constructor(
    private fb: FormBuilder,
    private alertaService: AlertServiceService,
    private msjService: MsjService,
    private usuarioService: UsuarioService,
    private facturaService: FacturaService,
    private router: Router,
    private overlay: Overlay,
    private sso: ScrollStrategyOptions,
    private pagoService: PagosService,
    private printService: NgxPrintService,
    private reportService : GeneratePDFService,
    private informacion : InformationService

  ) {

    this.getAll(1,10,this.informacion.tipoDocumento);
    this.moneda = this.usuarioService.usuarioLogueado.data.sucursal.empresa.moneda;
    facturaService.facturaEdit = undefined;
    this.document = informacion.tipoDocumento;
  }
  dialog = inject(MatDialog);
  pageNumbewr: number = 0;
  pageSize: number = 0;
  facturaForPrint: any;
  document : string="";
 

  openDialog(factura: iFactura) {
    if (factura.montoPorPagar > 0) {
      this.pagoService.facturaPagar = factura;
      var ref = this.dialog.open(PagoFacturaComponent, { hasBackdrop: true })
      ref.beforeClosed().subscribe(c => {
        this.getAll(1,10,this.facturaService.document);
      }
)

    }
    else
      this.alertaService.warnigAlert("Ten en cuenta que no puedes agregar pagos a facturas ya cobrada o canceladas.")
  }

  dataList: iFactura[] = [];
  cargando: boolean = false;
  sinRegistros: boolean = false;
  checked = false;
  moneda!: iMoneda;
  sinRegistrosTxt: string = "";
  paginations: number[] = [1];
  filtro: string = "";

  async delete(id: any) {
    if (await this.alertaService.questionDelete()) {
      this.alertaService.ShowLoading();
      this.facturaService.delete(id).subscribe(((data: ServiceResponse) => {
        if (data.status) {
          this.alertaService.successAlert(data.message);
          this.getAll(1,10,this.facturaService.document);
        }
        else {
          this.alertaService.errorAlert(data.message)
        }
      }))
    }
  }

  editar(Factura: iFactura) {
    if (Factura.montoPorPagar === 0) {
      this.alertaService.warnigAlert("La factura no se puede editar Ten en cuenta que para editarla no puede estar cancelada o tener algún pago asociado.")
    }
    else {
      this.cargando = true;
      this.facturaService.getById(Factura.idFactura!).subscribe((data: any) => {
        console.log(data)
        this.facturaService.facturaEdit = data.data;
        this.router.navigateByUrl('layout/factura');
      })
    }
  }

  verFactura(idFactura: number) {
    if(this.informacion.tipoDocumento==='Cotización'){
      this.router.navigateByUrl(`layout/detalle_cotizacion/${idFactura}`);
    }
    else{
      this.router.navigateByUrl(`layout/detalle_factura/${idFactura}`);
    }
  }

  update() {
    this.alertaService.ShowLoading();
    
  }

  getAll(pageNumber: number, pageSize: number = 10, tipoDocumento : string="") {
    pageNumber = pageNumber < 0 ? pageNumber = 1 : pageNumber;
    if (this.paginations.filter(c => c >= pageNumber && c > 0).length > 0) {
      this.pageNumbewr = pageNumber;
      this.pageSize = pageSize;
      this.cargando = true;
      this.facturaService.getAll(this.usuarioService.usuarioLogueado.data.sucursal.idSucursal, pageNumber, pageSize, this.informacion.tipoDocumento==="Cotización"? 2 : 1).subscribe((data: ServiceResponse) => {
        this.dataList=data.data;
        if (this.dataList.length > 0) {
          this.sinRegistros = false
          this.cargando = false;
          this.loadPaginacion(data.totalPage)
        }
        else {
          this.sinRegistros = true;
          this.sinRegistrosTxt = data.message;
          this.cargando = false;
        }
      })
    }
  }


  getAllFilter(event: any) {
    const filtro = (event.target as HTMLInputElement).value;
    this.filtro = filtro;
    if (filtro == "") {
      // this.getAll();
    }
    else {
      this.cargando = true;
      // this.facturaService.getAllFilter(filtro).subscribe((data: any) => {
      //   this.dataList = data.data;
      //   if (this.dataList.length > 0) {
      //     this.sinRegistros = false
      //     this.cargando = false;
      //   }
      //   else {
      //     this.sinRegistros = true;
      //     this.cargando = false;
      //   }
      // })
    }

  }

  loadPaginacion(valu: number) {
    this.paginations = [];
    for (let i = 1; i < valu + 1; i++) {
      this.paginations.push(i)
      console.log(i)
    }

  }
  getFacturaByIdForPrint(idFactura: number) {
    this.facturaService.getById(idFactura!).subscribe((data: ServiceResponse) => {
      this.facturaForPrint = data.statusCode == 200 ? data.data : undefined;
      this.facturaService.facturaEdit = this.facturaForPrint;
      this.prtinReportPdf();
    })
    
   

  }



  printFactura() {
    const customPrintOptions: PrintOptions = new PrintOptions({
      printSectionId: 'print-section',
      printTitle: "Factura",
      useExistingCss: true,
      openNewTab: false,
      previewOnly: false,
      closeWindow: true,
      printDelay: 10,
    });
    this.printService.print(customPrintOptions)
  }
//  Prueba de implementacion de generacion de reportes via pdf
  prtinReportPdf(){
    var ref = this.dialog.open(FacturaReportComponent, { hasBackdrop: true })
    ref.beforeClosed().subscribe(c => {
      this.getAll(1,10,this.facturaService.document);
    });
   

    // this.reportService.generatePDF('print-section', 'mi-documento.pdf');

    // const element: HTMLElement = document.getElementById('print-section')!;
    // html2canvas(element, {scale:3, useCORS: true}).then(canvas => {
    //   const imgData = canvas.toDataURL('image/png');
    //   const pdf = new jsPDF('p', 'mm', 'letter');

    //   // Ajustar imagen al tamaño de la página
    //   const imgWidth = 216; // A4 width en mm
    //   const imgHeight = (canvas.height * imgWidth) / canvas.width;

    //   pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    //   // Generar Blob y abrir en una nueva ventana
    //   const pdfBlob = pdf.output('blob');
    //   const url = URL.createObjectURL(pdfBlob);
    //   window.open(url, '_blank');
    // });
  }

  addNewDocument(){
    if(this.facturaService.document==="Cotización")
      {
        this.router.navigate(['layout/cotizacion']);
      }
      else
      {
        this.router.navigate(['layout/factura']);
      }
  }





}
