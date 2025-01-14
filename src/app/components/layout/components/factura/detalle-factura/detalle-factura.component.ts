import { Component, inject } from '@angular/core';
import { importaciones } from '../../../../utilities/material/material';
import { iDetalleFactura, iFactura, iiMpuesto, iMoneda, iPago } from '../../../../../interfaces/iTermino';
import { FacturaService } from '../../../../../services/factura.service';
import { UsuarioService } from '../../../../../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertServiceService } from '../../../../utilities/alert-service.service';
import { ServiceResponse } from '../../../../../interfaces/service-response-login';
import { PagosService } from '../../../../../services/pagos.service';
import { NgxPrintService, PrintOptions } from 'ngx-print';
import { FacturaReportComponent } from '../../../../../reports/factura-report/factura-report.component';
import { MatDialog } from '@angular/material/dialog';
import { InformationService } from '../../../../../services/information.service';

@Component({
  selector: 'app-detalle-factura',
  standalone: true,
  imports: [
    importaciones
  ],
  templateUrl: './detalle-factura.component.html',
  styleUrl: './detalle-factura.component.css'
})
export class DetalleFacturaComponent {

  factura!: iFactura;
  idFactura!: number;
  pagosDataList: iPago[] = [];
  moneda: string = "";
  dataListIMpuestos: iiMpuesto[] = [];
  cargando = true;
  verFactura = true;
  dialog = inject(MatDialog);
  constructor(
    private facturaService: FacturaService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private alertas: AlertServiceService,
    private pagosService: PagosService,
    private printService: NgxPrintService,
    private router: Router,
    private informationService : InformationService

  ) {
    route.paramMap.subscribe((params: any) => {
      this.idFactura = params.get("id")
    })
    alertas.ShowLoading();
    facturaService.getById(this.idFactura).subscribe((r: ServiceResponse) => {
      this.factura = r.data;
      facturaService.facturaEdit = this.factura;
      //   this.factura.detalle.forEach((i: iDetalleFactura) => {
      //     i.impuestosObject?.forEach(c=>{
      //       i.impuestosObject?.map(c=>{
      //         c.monto = (this.factura.subTotal *(c.porcentaje /100))  
      //       })
      //       if(i.impuestosObject!==undefined) {
      //         this.dataListIMpuestos =  i.impuestosObject;
      //       }
      //   });
      // });

    });


    pagosService.getByIdFactura(this.idFactura).subscribe((r: ServiceResponse) => {
      this.pagosDataList = r.data;
      console.log(this.pagosDataList)
    })

    this.moneda = usuarioService.usuarioLogueado.data.sucursal.empresa.moneda.simbolo
    setTimeout(() => {
      this.cargando = false;
      this.alertas.hideLoading();
    }, 1000);
  }

  async deletPago(idPago: number) {
    if (await this.alertas.questionDelete()) {
      this.pagosService.delete(idPago).subscribe((data: ServiceResponse) => {
        this.alertas.successAlert(data.message)
        location.reload();
      })
    }
  }

  printFactura(factura: iFactura) {
    // const customPrintOptions: PrintOptions = new PrintOptions({
    //   printSectionId: 'print-section',
    //   printTitle: "Factura",
    //   useExistingCss: true,
    //   openNewTab: false,
    //   previewOnly: false,
    //   closeWindow: true,
    //   printDelay: 10
    

    //   // Add any other print options as needed
    // });
    // this.printService.print(customPrintOptions)
    this.prtinReportPdf();
  }


  prtinReportPdf() {
    var ref = this.dialog.open(FacturaReportComponent, { hasBackdrop: true })
  }

  editar(Factura: iFactura) {
    if (Factura.montoPorPagar === 0) {
      this.alertas.warnigAlert("La factura no se puede editar Ten en cuenta que para editarla no puede estar cancelada o tener algún pago asociado.")
    }
    else {
      this.facturaService.getById(Factura.idFactura!).subscribe((data: any) => {
        this.facturaService.facturaEdit = data.data;
        this.router.navigateByUrl('layout/factura');
        this.alertas.hideLoading();

      })
    }
  }

  retroceder(){
    if(this.informationService.tipoDocumento==='Cotización'){
      this.router.navigate(['layout/cotizaciones']);
    }
    else{
      this.router.navigate(['layout/facturas'])
    }
  }


}
