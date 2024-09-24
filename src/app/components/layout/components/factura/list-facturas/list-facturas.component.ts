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
    private usuarioService : UsuarioService,
    private facturaService : FacturaService,
    private router : Router,
    private overlay: Overlay, 
    private sso: ScrollStrategyOptions,
    private pagoService : PagosService

  ) {
   
    this.getAll();
    this.moneda = this.usuarioService.usuarioLogueado.data.sucursal.empresa.moneda;
  }
  dialog = inject(MatDialog);


  ngOnInit(): void {
  }

  openDialog(factura : iFactura) {
    if(factura.montoPorPagar>0){
      this.pagoService.facturaPagar = factura;
      var ref = this.dialog.open(PagoFacturaComponent, {hasBackdrop: true})
      ref.beforeClosed().subscribe(c=>{
        this.getAll();
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
  moneda! : iMoneda;
  sinRegistrosTxt : string =""; 

  async delete(id: any) {
    if (await this.alertaService.questionDelete()) {
      this.alertaService.ShowLoading();
      this.facturaService.delete(id).subscribe(((data: ServiceResponse) => {
        if (data.status) {
          this.alertaService.successAlert(data.message);
          this.getAll();
        }
        else {
          this.alertaService.errorAlert(data.message)
        }
      }))
    }
  }

  editar(Factura: iFactura) {

    if(Factura.montoPorPagar===0)
    {
      this.alertaService.warnigAlert("La factura no se puede editar Ten en cuenta que para editarla no puede estar cancelada o tener algún pago asociado.")
    }
    else
    { 
      this.cargando = true;
      this.facturaService.getById(Factura.idFactura!).subscribe((data: any) => {
        console.log(data)
        this.facturaService.facturaEdit = data.data;
        this.router.navigateByUrl('layout/factura');
      })
      
    }
   
  }

  update() {
    this.alertaService.ShowLoading();
  }

  getAll() {
    this.cargando = true;
    this.facturaService.getAll(this.usuarioService.usuarioLogueado.data.sucursal.idSucursal).subscribe((data: any) => {
      this.dataList = data.data;
      if (this.dataList.length > 0) {
        this.sinRegistros = false
        this.cargando = false;    
      }
      else {
        this.sinRegistros = true;
        this.sinRegistrosTxt = data.message;
        this.cargando = false;
      }
    })
  }


  getAllFilter(event : any) {
    const filtro = (event.target as HTMLInputElement).value;
    if(filtro=="")
      {
        this.getAll();
      }
      else{
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


  
}
