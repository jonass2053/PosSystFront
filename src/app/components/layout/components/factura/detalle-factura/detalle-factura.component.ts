import { Component } from '@angular/core';
import { importaciones } from '../../../../utilities/material/material';
import { iDetalleFactura, iFactura, iiMpuesto, iMoneda, iPago } from '../../../../../interfaces/iTermino';
import { FacturaService } from '../../../../../services/factura.service';
import { UsuarioService } from '../../../../../services/usuario.service';
import { ActivatedRoute } from '@angular/router';
import { AlertServiceService } from '../../../../utilities/alert-service.service';
import { ServiceResponse } from '../../../../../interfaces/service-response-login';
import { PagosService } from '../../../../../services/pagos.service';
import { NgxPrintService, PrintOptions } from 'ngx-print';

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

  factura! : iFactura;
  idFactura! :  number;
  pagosDataList :  iPago[]=[];
  moneda : string="";
  dataListIMpuestos : iiMpuesto[]=[];
  cargando = true;
  verFactura = true;
  constructor(
    private facturaService : FacturaService,
    private usuarioService : UsuarioService,
    private route : ActivatedRoute,
    private alertas : AlertServiceService,
    private pagosService : PagosService,
    private printService : NgxPrintService
  )
  {
    route.paramMap.subscribe((params : any)=>{
      this.idFactura = params.get("id")
    })
    this.factura = facturaService.facturaEdit;
    alertas.ShowLoading();
    facturaService.getById(this.idFactura).subscribe((r: ServiceResponse)=>{
      this.factura =r.data;
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


    pagosService.getByIdFactura(this.idFactura).subscribe((r: ServiceResponse)=>{
      this.pagosDataList = r.data;
      console.log(this.pagosDataList)
    })

    this.moneda=usuarioService.usuarioLogueado.data.sucursal.empresa.moneda.simbolo
    setTimeout(() => {
      this.cargando=false;
      this.alertas.hideLoading();
    }, 1000);
  }
  
   async deletPago(idPago : number){
    if(await this.alertas.questionDelete()){
      this.pagosService.delete(idPago).subscribe((data: ServiceResponse)=>{
        this.alertas.successAlert(data.message)
        location.reload();
      })
    }
  }

  printFactura(factura : iFactura){ 
        const customPrintOptions: PrintOptions = new PrintOptions({
    printSectionId: 'print-section',
    printTitle: "Factura",
    useExistingCss: true,
    openNewTab: false,
    previewOnly: false,
    closeWindow: true,
    printDelay: 10
   
   
    // Add any other print options as needed
});
this.printService.print(customPrintOptions)
 }

}
