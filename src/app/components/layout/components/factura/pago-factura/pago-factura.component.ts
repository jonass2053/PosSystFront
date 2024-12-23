import { Component } from '@angular/core';
import { importaciones, material } from '../../../../utilities/material/material';
import { BancosService } from '../../../../../services/bancos.service';
import { iBanco, iMetodoPago, iMoneda } from '../../../../../interfaces/iTermino';
import { ServiceResponse } from '../../../../../interfaces/service-response-login';
import { UsuarioService } from '../../../../../services/usuario.service';
import { FacturaService } from '../../../../../services/factura.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PagosService } from '../../../../../services/pagos.service';
import { AlertServiceService } from '../../../../utilities/alert-service.service';
@Component({
  selector: 'app-pago-factura',
  standalone: true,
  imports: [
    importaciones,
    MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './pago-factura.component.html',
  styleUrl: './pago-factura.component.css',
  
})

export class PagoFacturaComponent {

  constructor(
    private bancoService : BancosService,
    private usuarioService : UsuarioService,
    private facturaService : FacturaService,
    private fb : FormBuilder,
    private pagoService : PagosService,
    private alertas : AlertServiceService,
    public dialogRef: MatDialogRef<PagoFacturaComponent>,
  )
  {
    if (this.usuarioService.usuarioLogueado != undefined) {
      this.moneda = this.usuarioService.usuarioLogueado.data.sucursal.empresa.moneda;
    }
      if(this.pagoService.facturaPagar!=null)
        {
            this.nombreCliente = this.pagoService.facturaPagar.contacto.nombreRazonSocial;
            this.noFactura = this.pagoService.facturaPagar.numeracion;
            this.montoPorPagar = this.pagoService.facturaPagar.montoPorPagar;
            this.miFormulario.patchValue({
              idFactura : this.pagoService.facturaPagar.idFactura, 
              idContacto : this.pagoService.facturaPagar.idContacto,
              monto : this.pagoService.facturaPagar.montoPorPagar
             })
        }
      this.getBancos();
      this.getMetodoPago();
  }
  miFormulario : FormGroup = this.fb.group({
    idPago : this.fb.control(null),
    idFactura : this.fb.control(null),
    idContacto : this.fb.control(null),
    idMetodoPago: this.fb.control("", Validators.required),
    idBanco : this.fb.control("", Validators.required),
    monto : this.fb.control(0, Validators.required),
    notaPago:this.fb.control(''),
    noTicket : this.fb.control('')

  })
  noFactura : string ='';
  nombreCliente : string='';
  montoPorPagar : number=0;
  dataListBanco : iBanco[]=[];
  dataListMetodoPago : iMetodoPago[]=[]; 
  moneda! : iMoneda;
 

  getBancos(){
    this.bancoService.getAll(this.usuarioService.usuarioLogueado.data.sucursal.idSucursal).subscribe((result : ServiceResponse)=>
    {  this.dataListBanco = result.data; })
  }
  getMetodoPago(){
    this.facturaService.getAllMetodoPago().subscribe((result : ServiceResponse)=>
    { this.dataListMetodoPago = result.data;})
  }

  selectMetodo(metodo : iMetodoPago){
    if(metodo.nombre.includes("EFECTIVO"))
        this.miFormulario.patchValue({idBanco : this.dataListBanco.find(c=>c.nombreCuenta.toUpperCase().includes("CAJA"))?.idBanco}) 
    else
     this.miFormulario.patchValue({idBanco : ""}) 

  }

  insert(){
      this.pagoService.insert(this.miFormulario.value).subscribe((result : ServiceResponse)=>{
        if(result.statusCode==200){
          this.closeDialog();
          this.alertas.successAlert(result.message);
        }
        else
          this.alertas.errorAlert(result.message)});
  }

  update(){
      this.pagoService.update(this.miFormulario.value).subscribe((result : ServiceResponse)=>{
        if(result.status)
        {
          this.alertas.successAlert(result.message);
          this.closeDialog();

        }
        else
          this.alertas.errorAlert(result.message)})
  }
  delete(idPago : number){
      this.pagoService.delete(idPago).subscribe((result : ServiceResponse)=>{
        if(result.status)
        {
          this.alertas.successAlert(result.message)
          this.closeDialog();
        }
        else
          this.alertas.errorAlert(result.message)})

  }
 
  save(){
    if(this.miFormulario.valid){
      this.miFormulario.value.idPago===null? this.insert() : this.update();
    }
  }

  reset(){
    this.miFormulario.reset();
  }

   closeDialog(): void {
    this.dialogRef.close();
  }



  


}

