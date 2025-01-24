import { Component, inject } from '@angular/core';
import { importaciones } from '../../../utilities/material/material';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertServiceService } from '../../../utilities/alert-service.service';
import { MsjService } from '../../../utilities/msj.service';
import { ProductoService } from '../../../../services/producto.service';
import { iProducto, iContactoPos, iTermino, iVendedor, idNumeracion, idTipoContacto, iUnidades, iCuentas, iiMpuesto, iAlmacen, iCategoria, iMarca, iModelo, iImpuestoProductoCodigo, iMoneda, iPago, iFactura } from '../../../../interfaces/iTermino';
import { ThemePalette, provideNativeDateAdapter } from '@angular/material/core';
import { ServiceResponse } from '../../../../interfaces/service-response-login';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { Observable, debounceTime, map, of, startWith, switchMap } from 'rxjs';
import { ImpuestosService } from '../../../../services/impuestos.service';
import { Console, log } from 'console';
import { AlmacenService } from '../../../../services/almacen.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { MarcasService } from '../../../../services/marcas.service';
import { ModelosService } from '../../../../services/modelos.service';
import { blob, json } from 'stream/consumers';
import { InformationService } from '../../../../services/information.service';
import { PagosService } from '../../../../services/pagos.service';
import { MatDialog } from '@angular/material/dialog';
import { PagoFacturaComponent } from '../factura/pago-factura/pago-factura.component';
import { FacturaService } from '../../../../services/factura.service';
@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [
    importaciones
  ],
  templateUrl: './pagos.component.html',
  styleUrl: './pagos.component.css'
})
export class PagosComponent {
  constructor(
    private fb: FormBuilder,
    private alertaService: AlertServiceService,
    private msjService: MsjService,
    private pagoService: PagosService,
    private impuestoService: ImpuestosService,
    private almacenService: AlmacenService,
    private usuarioService: UsuarioService,
    private marcaService: MarcasService,
    private modeloService: ModelosService,
    private informationService : InformationService,
    private facturaService : FacturaService

  ){

    this.getAll();
    this.moneda = this.usuarioService.usuarioLogueado.data.sucursal.empresa.moneda;
  }
 dialog = inject(MatDialog);
  moneda! : iMoneda;
  cargando  : boolean = false;
  sinRegistros : boolean = false;
  dataList : iPago[]=[];
  sinRegistrosTxt :  String ="No se ha encontrado ningun registro."



  async delete(id: any) {
    if (await this.alertaService.questionDelete()) {
      this.alertaService.ShowLoading();
      this.pagoService.delete(id).subscribe(((data: ServiceResponse) => {
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



  getAll() {
    this.alertaService.ShowLoading();
    this.pagoService.getAll(this.informationService.idSucursal).subscribe((data : ServiceResponse)=>{
      this.dataList = data.data;
      this.alertaService.hideLoading();
    })}

  
   edit(pago: iPago){
      this.pagoService.facturaPagar = pago.facturaObj;
      this.pagoService.pagoForEdit = pago;
      var ref = this.dialog.open(PagoFacturaComponent, { hasBackdrop: true })
      ref.beforeClosed().subscribe(c => {
        this.getAll();
        this.pagoService.pagoForEdit.idPago=0;
      })}
     
       
      
 

  getAllFilter(event: any) {
    const filtro = (event.target as HTMLInputElement).value;
    if (filtro == "") {
      this.getAll();
    }
    else {
      this.cargando = true;
      // this.pagoService.getAllFilter(filtro).subscribe((data: any) => {
      //   this.dataList = data.data;
       
      // })
    }

  }





showLoading(){
  this.cargando = this.cargando===true? false : true;
}
 

  

 
}
