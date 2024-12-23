import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxPrintService, PrintOptions } from 'ngx-print';
import { FacturaService } from '../../services/factura.service';
import { iFactura } from '../../interfaces/iTermino';
import { parse } from 'path';
import { importaciones } from '../../components/utilities/material/material';
import { AlertServiceService } from '../../components/utilities/alert-service.service';

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
    private alertService : AlertServiceService
  
  ){
     
      
  }
  ngAfterViewInit(){
    this.getFacturaById();
    setTimeout(() => {
      this.printFactura()
    }, 1000);
  
  }
  id! : number;
  factura! : iFactura;

  getFacturaById(){
    this.alertService.ShowLoading();
    let id =(this.route.snapshot.paramMap.get('id'));
    this.id = parseInt(id!);
    this.facturaService.getById(this.id).subscribe((data: any) => {
      this.factura = data.data;
     this.alertService.hideLoading();
  })}
  
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