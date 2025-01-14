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
    private contactoService : ContactosService,
    private facturaService : FacturaService,
    private bancoService : BancosService,
    private usuarioService : UsuarioService,
    private informationService : InformationService) {
    this.getMetodoPago();
    this.getBancos();
    this.moneda = usuarioService.usuarioLogueado.data.sucursal.empresa.moneda.simbolo;

  } 
  dataListContactos: iContactoPos[] = [];
  dataListMetodoPago : iMetodoPago[]=[]; 
  dataListBanco : iBanco[]=[];
  dataListFacturasPendientes : iFactura[]=[];
  pagosDataList: iPago[] = [];
  moneda: string = "";
  msjTablePagos : string="Selecciones un cliente para ver sus facturas pendientes";
  montos : {idFactura: number , montoPagado : number}[] =[];
  montoDeudor : number = 0;
  indexFacturaPorPagar: number=0;
  montoResult : number=0;
  formularios : FormGroup[]=[];
  

  miFormulario : FormGroup = this.fb.group({
    idPago : this.fb.control(null),
    idFactura : this.fb.control(null),
    idContacto : this.fb.control(null),
    idMetodoPago: this.fb.control("", Validators.required),
    idBanco : this.fb.control("", Validators.required),
    monto : this.fb.control(0, Validators.required),
    notaPago:this.fb.control(''),
    noTicket : this.fb.control(''),
    nombreClienteCompleto : this.fb.control(""),
    fecha : this.fb.control('')
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

    getBancos(){
      this.bancoService.getAll(this.usuarioService.usuarioLogueado.data.sucursal.idSucursal).subscribe((result : ServiceResponse)=>
      {  this.dataListBanco = result.data; })
    }

    getFacturasPendientes(){
      this.facturaService.getAllFacturasPendientes(this.informationService.idSucursal, this.miFormulario.value.idContacto, 1, 100).subscribe((data : ServiceResponse)=>{
        this.dataListFacturasPendientes = data.data;
        this.msjTablePagos = data.data.length==0? 'El cliente no tiene ninguna factura pendiente' : this.msjTablePagos; 
        data.data.forEach((f:iFactura) => {
          this.montoDeudor+=f.montoPorPagar;
          if(f.idFactura!=undefined){
            this.montos.push({idFactura : f.idFactura, montoPagado : 0})
          }
        });
      })
    }

    createMultyPayment(){

    }
   


    SumarMontoTotalPagado(event : any){
      let valor = (event.target as HTMLInputElement).value;
      this.montoResult=0;
      if(valor!==''){
        this.montos[this.indexFacturaPorPagar].montoPagado = parseFloat(valor);
      }else{
       this.montos[this.indexFacturaPorPagar].montoPagado=0;
      }
      this.montos.forEach(element => {
        this.montoResult+= element.montoPagado
       });
     
    }

    getIndex(index : any){
      this.indexFacturaPorPagar =  index;
    }
    
  }
