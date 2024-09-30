import { Component } from '@angular/core';
import { importaciones } from '../../../../utilities/material/material';
import { iDetalleFactura, iFactura, iiMpuesto, iMoneda, iPago } from '../../../../../interfaces/iTermino';
import { FacturaService } from '../../../../../services/factura.service';
import { UsuarioService } from '../../../../../services/usuario.service';
import { ActivatedRoute } from '@angular/router';
import { AlertServiceService } from '../../../../utilities/alert-service.service';
import { ServiceResponse } from '../../../../../interfaces/service-response-login';
import { PagosService } from '../../../../../services/pagos.service';

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
  constructor(
    private facturaService : FacturaService,
    private usuarioService : UsuarioService,
    private route : ActivatedRoute,
    private alertas : AlertServiceService,
    private pagosService : PagosService
  )
  {
    route.paramMap.subscribe((params : any)=>{
      this.idFactura = params.get("id")
    })
    this.factura = facturaService.facturaEdit;
    alertas.ShowLoading();
    facturaService.getById(this.idFactura).subscribe((r: ServiceResponse)=>{
      this.factura =r.data;
      this.factura.detalle.forEach((i: iDetalleFactura) => {
        i.impuestosObject?.forEach(c=>{
          i.impuestosObject?.map(c=>{
            c.monto = (this.factura.subTotal *(c.porcentaje /100))  
          })
          if(i.impuestosObject!==undefined) {
            this.dataListIMpuestos =  i.impuestosObject;
          }
      });
    });
    
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

    console.log(this.dataListIMpuestos)

  }
  
  



}
