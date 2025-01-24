import { Component } from '@angular/core';
import { importaciones } from '../../../../utilities/material/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { iBanco, iContactoPos, iFactura, iMetodoPago, iPago, iProducto } from '../../../../../interfaces/iTermino';
import { ContactosService } from '../../../../../services/contactos.service';
import { ServiceResponse } from '../../../../../interfaces/service-response-login';
import { FacturaService } from '../../../../../services/factura.service';
import { BancosService } from '../../../../../services/bancos.service';
import { UsuarioService } from '../../../../../services/usuario.service';
import { InformationService } from '../../../../../services/information.service';
import { PagosService } from '../../../../../services/pagos.service';
import { AlertServiceService } from '../../../../utilities/alert-service.service';

@Component({
  selector: 'app-addpago',
  standalone: true,
  imports: [
    importaciones
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './addpago.component.html',
  styleUrl: './addpago.component.css'
})
export class AddpagoComponent {

  constructor(
    private fb: FormBuilder,
    private contactoService: ContactosService,
    private facturaService: FacturaService,
    private bancoService: BancosService,
    private usuarioService: UsuarioService,
    private pagoService: PagosService,
    private informationService: InformationService,
    private alertas: AlertServiceService) {
    this.getMetodoPago();
    this.getBancos();
    this.moneda = usuarioService.usuarioLogueado.data.sucursal.empresa.moneda.simbolo;

  }
  dataListContactos: iContactoPos[] = [];
  dataListMetodoPago: iMetodoPago[] = [];
  dataListBanco: iBanco[] = [];
  dataListFacturasPendientes: iFactura[] = [];
  pagosDataList: iPago[] = [];
  moneda: string = "";
  msjTablePagos: string = "Selecciones un cliente para ver sus facturas pendientes";
  montos: { idFactura: number, monto: number }[] = [];
  montoDeudor: number = 0;
  indexFacturaPorPagar: number = 0;
  montoResult: number = 0;
  formularios: FormGroup[] = [];
  montoPendiente: number = 0;
  montoValidate : boolean = true;

  miFormulario: FormGroup = this.fb.group({
    idPago: this.fb.control(null),
    idFactura: this.fb.control(null),
    idContacto: this.fb.control(null),
    idMetodoPago: this.fb.control("", Validators.required),
    idBanco: this.fb.control("", Validators.required),
    monto: this.fb.control(0, Validators.required),
    notaPago: this.fb.control(''),
    noTicket: this.fb.control(''),
    nombreClienteCompleto: this.fb.control(""),
    fecha: this.fb.control('', Validators.required),
    MultiPayment: this.fb.control([]),
    
  })

  selectContacto(event: any) {
    this.miFormulario.patchValue(
      {
        identificacion: event.option.value.rnc,
        telefono: event.option.value.telefono1,
        idContacto: event.option.value.idContacto,
      })
    this.getFacturasPendientes();
  }
  searchContacto(event: any) {
    let valor = (event.target as HTMLInputElement).value;
    if (valor.length > 0) {
      this.contactoService.getAllFilter((event.target as HTMLInputElement).value).subscribe((data: ServiceResponse) => {
        this.dataListContactos = data.data.filter((c: iContactoPos) => c.idTipoContacto != 2);
      })
    }
  }


  displayFn(contacto?: iContactoPos): string | undefined | any {

    return contacto ? contacto.nombreRazonSocial : undefined;
  }

  getMetodoPago() {
    this.facturaService.getAllMetodoPago().subscribe((result: ServiceResponse) => { this.dataListMetodoPago = result.data; })
  }


  selectMetodo(metodo: iMetodoPago) {
    if (metodo.nombre.includes("EFECTIVO"))
      this.miFormulario.patchValue({ idBanco: this.dataListBanco.find(c => c.nombreCuenta.toUpperCase().includes("CAJA"))?.idBanco })
    else
      this.miFormulario.patchValue({ idBanco: "" })
  }

  getBancos() {
    this.bancoService.getAll(this.usuarioService.usuarioLogueado.data.sucursal.idSucursal).subscribe((result: ServiceResponse) => { this.dataListBanco = result.data; })
  }

  getFacturasPendientes() {
    this.facturaService.getAllFacturasPendientes(this.informationService.idSucursal, this.miFormulario.value.idContacto, 1, 100).subscribe((data: ServiceResponse) => {
      this.dataListFacturasPendientes = data.data;
      this.msjTablePagos = data.data.length == 0 ? 'El cliente no tiene ninguna factura pendiente' : this.msjTablePagos;
      data.data.forEach((f: iFactura) => {
        this.montoDeudor += f.montoPorPagar;
        if (f.idFactura != undefined) {
          this.montos.push({ idFactura: f.idFactura, monto: 0 })
        }
      });
    })
  }

  createMultyPayment() {
    this.validatePayment();
    this.validateMontos();
    if(this.montoValidate===true && this.miFormulario.valid){
      this.miFormulario.patchValue({MultiPayment : this.montos.filter(c=>c.monto>0)})
      this.pagoService.insertMultyPayments(this.miFormulario.value).subscribe((data: ServiceResponse)=>{
       if(data.statusCode==200){
        this.resetForm();
         this.alertas.successAlert(data.message)
       }else{
         this.alertas.errorAlert(data.message)
       }
      })
    }else{
      this.alertas.camposVacios();
    }
  }

  validateMontos(){
    this.montos.forEach(element => {
      if(element.monto>this.dataListFacturasPendientes.filter(c=>c.idFactura==element.idFactura)[0].montoPorPagar){
        this.montoValidate=false;
        this.alertas.warnigAlert("Los pagos no pueden ser mayores que la cantidad deudora.")
      }
       });

  }


  SumarMontoTotalPagado(event: any) {
    let valor = (event.target as HTMLInputElement).value === "" ? '0' : (event.target as HTMLInputElement).value;
    // validacion para que el valor ingresado no sea mayor que el monto de la fila
      if (valor === '0') {
        this.montos[this.indexFacturaPorPagar].monto = 0;
      } else {
        this.montos[this.indexFacturaPorPagar].monto = parseFloat(valor);
      }
      this.montoResult = 0;
      this.montoPendiente = 0;
      this.montos.forEach(element => {
        this.montoResult += element.monto;
        this.montoPendiente = this.montoDeudor - this.montoResult;
      });
      this.montoValidate=true;
    
  }

  //  Esto valida que no me mande pago cuando cuando no se haya realizado ningun pago
  validatePayment(){
   if(this.montos.filter(c=>c.monto==0).length===this.dataListFacturasPendientes.length){
    this.montoValidate=false;
    this.alertas.warnigAlert("No se ha ingresado ningun pago");
   }
  }
  getIndex(index: any) {
    this.indexFacturaPorPagar = index;
  }
  resetForm(){
    this.miFormulario.reset();
    this.dataListFacturasPendientes=[];
    this.montoDeudor=0;
    this.montoPendiente=0;
    this.montoResult=0;
    this.montoValidate==false;
  }
  

}
