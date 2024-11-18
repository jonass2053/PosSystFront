import { Component, ElementRef, ViewChild } from '@angular/core';
import { MY_DATE_FORMATS, importaciones } from '../../../utilities/material/material';
import { iBanco, iContactoPos, iDetalleFactura, iFactura, iMoneda, iProducto, iTermino, iTipoDocumento, iVendedor, idNumeracion, iiMpuesto } from '../../../../interfaces/iTermino';
import { UsuarioService } from '../../../../services/usuario.service';
import { AlertServiceService } from '../../../utilities/alert-service.service';
import { ContactosService } from '../../../../services/contactos.service';
import { ServiceResponse } from '../../../../interfaces/service-response-login';
import { stringify } from 'querystring';
import { MAT_DATE_FORMATS, provideNativeDateAdapter } from '@angular/material/core';
import { TerminosService } from '../../../../services/terminos.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { NumeracionService } from '../../../../services/numeracion.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { addDays } from 'date-fns';
import { DatePipe } from '@angular/common';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { VendedoresService } from '../../../../services/vendedores.service';
import { ProductoService } from '../../../../services/producto.service';

import { constrainedMemory, exit } from 'process';
import { FacturaService } from '../../../../services/factura.service';
import { BancosService } from '../../../../services/bancos.service';
import { json } from 'stream/consumers';
declare var $ : any;

@Component({
  selector: 'app-factura',
  standalone: true,
  imports: [
    importaciones
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    provideNativeDateAdapter(), DatePipe,

  ],
  templateUrl: './factura.component.html',
  styleUrl: 'factura.component.css'
})
export class FacturaComponent {
  @ViewChild('exampleModal') myModal!: ElementRef;


  firstFormGroup = this.fb.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this.fb.group({
    secondCtrl: [''],
    noComprobante : [''],
    observacionPago : [''],
    totalRecibido : [''],
    cambio : ['']
  });
  isEditable = false;
  metodoPagoSeleccionado = "";
  moneda! : iMoneda;
  prodcutoSeleccionado! : iProducto;
  impuestoProduct : number = 0;


  constructor(
    private usuarioService: UsuarioService,
    private alertaService: AlertServiceService,
    private contactoService: ContactosService,
    private plazoService: TerminosService,
    private fb: FormBuilder,
    private numeracionService: NumeracionService,
    private datePipe: DatePipe,
    private vendedoresService: VendedoresService,
    private productoService: ProductoService,
    private facturaServcie: FacturaService,
    private bancoService : BancosService

  ) {
    if (this.usuarioService.usuarioLogueado != undefined) {
      this.moneda = this.usuarioService.usuarioLogueado.data.sucursal.empresa.moneda;
    }
    this.miFormulario.patchValue({ fecha: new Date() })
    this.getAllTerminos();
    this.getAllNumeracion();
    this.getAllVendedores();
    this.getTipoDocumentos();
    this.getAllBancos();
    if(facturaServcie.facturaEdit!=null)
    {
      console.log('editanado')
      console.log(facturaServcie.facturaEdit.contacto.nombreRazonSocial)
      this.editarFactura(facturaServcie.facturaEdit);
    }
    else
    {
      facturaServcie.facturaEdit = null;
    }
  
  }
 

  editarFactura(factura : iFactura){
    this.miFormulario.patchValue({
      idFactura : factura.idFactura,
      idNumeracion : factura.idNumeracion,
      idContacto : factura.idContacto,
      identificacion : factura.contacto.rnc,
      telefono :  factura.contacto.telefono1,
      idTipoDocumento : factura.idTipoDocumento,
      idSucursal : factura.idSucursal,
      idEmpresa : factura.idEmpresa,
      idTermino : factura.idTermino,
      idUsuario : factura.idUsuario,
      idVendedor : factura.idVendedor,
      vencimiento : factura.vencimiento,
      detalle : factura.detalle,
      subTotal : factura.subTotal,
      totalGeneral: factura.totalGeneral,
      nombreClienteCompleto : factura.contacto.nombreRazonSocial,
      montoPagado : factura.montoPagado, 
    })
    this.impuestosGenerales = factura.itbis;

    this.miFormulario.get('nombreClienteCompleto')?.setValue(factura.contacto); // Cambia "Opción 2" por el valor deseado
    this.dataListDetalleFactura = factura.detalle;
    console.log(this.dataListDetalleFactura)
    // this.dataListDetalleFactura.forEach(c=>{
    //   c.impuestosObject?.forEach (element => {
    //     this.dataListImpuestosDetails.push(element)
    //   });
    // })
    this.totalGeneral = factura.totalGeneral;
    this.subTotalGeneral = factura.subTotal;
    this.descuentoGeneral = factura.descuento;
    this.totalApagar = factura.montoPorPagar
   
     
  }

  miFormulario: FormGroup = this.fb.group({
    idFactura: this.fb.control(null),
    idNumeracion: this.fb.control({value: "", disabled: false } ,Validators.required),
    idContacto: this.fb.control("", Validators.required),
    idTipoDocumento: this.fb.control("", Validators.required),
    idSucursal: this.fb.control("", Validators.required),
    idEmpresa: this.fb.control("", Validators.required),
    idTermino: this.fb.control("", Validators.required),
    idUsuario: this.fb.control("", Validators.required),
    idVendedor: this.fb.control(null),
    identificacion: this.fb.control({value: "", disabled: true }),
    vencimiento: this.fb.control(""),
    telefono: this.fb.control({ value: "", disabled: true }),
    fecha: this.fb.control(""),
    descripcion: this.fb.control({ value: "", disabled: true }),
    precio: this.fb.control({ value: 0, disabled: false }),
    cantidad: this.fb.control(1),
    descuento: this.fb.control({ value: 0, disabled: false }),
    impuesto: this.fb.control(0),
    impuestos: this.fb.control(0),
    producto: this.fb.control(''),
    impuestoObjet: this.fb.control(""),
    subTotalDetails: this.fb.control(0),
    total: this.fb.control(0),
    subTotal: this.fb.control(0),
    totalGeneral: this.fb.control(0),
    itbis : this.fb.control(0),
    detalle: this.fb.control(""),
    comentario: this.fb.control(""),
    nombreClienteCompleto : this.fb.control(""),
    efectivo : this.fb.control(0),
    montoPagado : this.fb.control(0),
    nombreProducto :  this.fb.control(''),
    totalRecibido : this.fb.control(0),
    cambio : this.fb.control(0)

  })
  editando: boolean = false;
  idProducto: number=0;
  nombre: string = "";
  cantidad: number = 0;
  precio: number = 0;
  descuento: number = 0;
  impuestos: number = 0;
  subTotal: number = 0;
  cambio : number = 0;
  total: number = 0;
  identificacion: string = "jonas dia";
  telefono: string = "";
  efectivo : number =0;
  dataListNumeracion: idNumeracion[] = [];
  dataListVendedores: iVendedor[] = [];
  dataListDetalleFactura: iDetalleFactura[] = [];
  DetalleFactura: iDetalleFactura = { 
    idDetalleFactura: 0,
    nombre: "",
    descuentoProcentual: 0, 
    idFactura: 0,
    idProducto: 0, 
    cantidad: 0,
    precio: 0,
    subTotal: 0,
    descuento: 0, 
    impuestos: 0, 
    total: 0,
    productoObj : null,
    producto : null
   };
  subTotalGeneral: number = 0;
  descuentoGeneral: number = 0;
  totalGeneral: number = 0;
  descuentoPorcentual: number = 0;
  impuestosGenerales: number = 0;
  dataListTerminos: iTermino[] = [];
  dataListContactos: iContactoPos[] = [];
  dataListProductosSearch: iProducto[] = [];
  fechaVenvimiento: any;
  dataListImpuestosDetails: iiMpuesto[] = [];
  totalApagar : number= 0;
  descripcionPago : string="POR PAGAR";
  dataListBancos: iBanco[]=[];
  

  addDetails() {
    console.log(this.impuestos)
    let cantLocal = 0;
    if (this.idProducto==0) {
      this.alertaService.warnigAlert("Debe seleccionar un item y llenar los campos para poder agregar.")
    }
    else {
      let detalle: iDetalleFactura = {
         nombre: this.nombre
        , idProducto: this.idProducto
        , idDetalleFactura: 0
        , cantidad: this.cantidad
        , precio: this.precio
        , descuento: this.descuento 
        , descuentoProcentual: this.descuentoPorcentual
        , subTotal: this.subTotal
        , impuestos: this.impuestoProduct * this.cantidad
        , total: this.total
        , productoObj : this.prodcutoSeleccionado
        , producto :this.prodcutoSeleccionado
        }

      let proExit = this.dataListDetalleFactura.find(c=>c.idProducto==detalle.idProducto)
      if(proExit!==undefined){
         this.dataListDetalleFactura = this.dataListDetalleFactura.filter(c=>c.idProducto!=proExit.idProducto)
          proExit.idDetalleFactura= 0;
          proExit.cantidad+= this.cantidad;
          proExit.precio= this.precio;
          proExit.descuento+= this.descuento;
          proExit.descuentoProcentual+= this.descuentoPorcentual;
          proExit.subTotal+= this.subTotal;
          proExit.impuestos+= this.impuestos;
          proExit.total+= this.total;
          this.dataListDetalleFactura.push(proExit) 
          this.subTotalGeneral+= proExit.cantidad;
          cantLocal = proExit.cantidad;
      }
      else{
        cantLocal = detalle.cantidad;
        this.dataListDetalleFactura.push(detalle);
      }
 
      //Este codgio agrega los impuestos de cada producto que pertenece al detalle
      // this.miFormulario.value.impuestoObjet.forEach((element : iiMpuesto) =>
      // {
      //   let existImpuesto = this.dataListImpuestosDetails.find(c=>c.idImpuesto==element.idImpuesto)
      //   console.log(this.dataListImpuestosDetails)
      //   if(existImpuesto===undefined)
      //     {
      //       element.monto += (element.porcentaje/100)*this.subTotal;
      //       this.dataListImpuestosDetails.push(element);
      //     }
      //     else
      //     {
      //       this.dataListImpuestosDetails = this.dataListImpuestosDetails.filter(c=>c.idImpuesto!==existImpuesto.idImpuesto)
      //       existImpuesto.monto+=element.monto;
      //       this.dataListImpuestosDetails.push(existImpuesto);
      //     }
      // })

       this.calculoGeneral();
       this.resetDetails();
       this.editando = false;
    }

  }
 async removeItem(indice: number, detalle : iDetalleFactura){
    if (this.editando) {
      this.alertaService.warnigAlert("Esta editando una fila, debe finalizar una edicion para afectar otro registro.");
    }
    else if (await this.alertaService.questionDelete()){
      this.dataListDetalleFactura.splice(indice, 1);
      this.resetDetails();
      this.calculoGeneral();
      this.dataListImpuestosDetails = this.dataListImpuestosDetails.filter(c=>c.idProducto!=detalle.idProducto);
    }
  }

  searchContacto(event: any) {
    let valor = (event.target as HTMLInputElement).value;
    if (valor.length > 0) {
      this.contactoService.getAllFilter((event.target as HTMLInputElement).value).subscribe((data: ServiceResponse) => {
        this.dataListContactos = data.data.filter((c: iContactoPos) => c.idTipoContacto != 2);
        console.log(this.dataListContactos)
      })
    }
  }

  searchProducto(event: any) {
    let valor = (event.target as HTMLInputElement).value;
    if (valor.length > 0) {
      this.productoService.getAllFilterForDocument((event.target as HTMLInputElement).value).subscribe((data: ServiceResponse) => {
        this.dataListProductosSearch = data.data;
      })
    }
  }
  searchProductoEdit(valor: string, cant : number) {

    if (valor.length > 0) {
      this.productoService.getAllFilterForDocument(valor).subscribe((data: ServiceResponse) => {
        this.dataListProductosSearch = data.data;
        this.impuestoProduct  = Math.round((data.data[0].precioFinal - data.data[0].precioBase) * 100) / 100;
        this.miFormulario.patchValue({ producto: data.data[0], impuesto: this.impuestoProduct * cant })
      })
    }
  }


  displayFn(contacto?: iContactoPos): string | undefined | any {
    return contacto ? contacto.nombreRazonSocial : undefined;
  }

  displayFnProducto(producto?: iProducto): string | undefined | any {
    return producto ? producto.nombre : undefined;
  }

  getTipoDocumentos() {
    this.numeracionService.getAllTipoDocumentos().subscribe((data: ServiceResponse) => {
      if (data.status) {
        this.miFormulario.patchValue({ idTipoDocumento: data.data.find((c: iTipoDocumento) => c.nombre.toUpperCase().includes("FACTURA DE VENTA")).idTipoDocumento })
      }
    })
  }

  selectContacto(event: any) {
    this.miFormulario.patchValue(
      {
        identificacion: event.option.value.rnc,
        telefono: event.option.value.telefono1,
        idNumeracion: event.option.value.idTipoNumeracion,
        idContacto: event.option.value.idContacto
      })
      console.log(this.miFormulario.value)
    }

  selectProducto(event: any) {
    console.log(event.option.value.precioFinal - event.option.value.precioBase)
  console.log(event.option.value)
   this.idProducto = event.option.value.idProducto;
   this.nombre = event.option.value.nombre; 
   this.prodcutoSeleccionado = event.option.value;
   this.impuestoProduct =  Math.round((event.option.value.precioFinal - event.option.value.precioBase) * 100) / 100;
   
    this.miFormulario.patchValue(
      {
        cantidad: this.miFormulario.value.cantidad,
        descripcion: event.option.value.descripcion,
        precio: event.option.value.precioBase,
        impuesto : Math.round((event.option.value.precioFinal - event.option.value.precioBase) * 100) / 100
      })
    this.calcular();
  }

  selectProductoById(producto: any, impuestos : any) {
    this.idProducto = producto.idProducto!;
    this.nombre = producto.nombre; 
    this.miFormulario.patchValue(
      {
        cantidad: this.miFormulario.value.cantidad,
        descripcion: producto.descripcion,
        precio: producto.precioBase,
        impuesto :Math.round((producto.precioFinal - producto.precioBase) * 100) / 100
      })
    this.calcular();
  }
  selectProductoForEdit(item: iDetalleFactura) {
    this.idProducto = item.idProducto;
    this.nombre = item.nombre;
    this.miFormulario.patchValue(
      {
        cantidad: item.cantidad,
        nombre: item.nombre,
        precio: item.precio,

      })
    this.calcular();
  }



  getAllTerminos() {
    this.plazoService.getAll().subscribe((data: ServiceResponse) => {
      this.dataListTerminos = data.data;
      let dateNow = new Date();
      this.miFormulario.patchValue({ idTermino: data.data.find((c: iTermino) => c.predeterminado == true).idTermino })
      this.setVencimiento();
    })
  }


  calVencimiento(fecha: Date, dias: any) {
    return addDays(this.miFormulario.value.fecha, dias);
  }

  getAllNumeracion() {
    this.numeracionService.getAll().subscribe((data: ServiceResponse) => {
      this.dataListNumeracion = data.data;
      if(this.facturaServcie.facturaEdit==undefined ){
        // console.log('dentro')
        // this.miFormulario.patchValue({ "idNumeracion": (data.data.find((c: idNumeracion) => c.predeterminada == true)).idNumeracion })
      }
    })
  }

  setVencimiento() {
    let dias = this.dataListTerminos.find((c: iTermino) => c.idTermino == this.miFormulario.value.idTermino)?.dias;
    let fechaVencimiento = this.calVencimiento(this.miFormulario.value.fecha, dias);
    // let fechaFormateada = this.datePipe.transform(fechaVencimiento, 'yyyy-MM-dd hh:mm:ss');
    let fechaFormateada = fechaVencimiento;
    this.miFormulario.patchValue({ vencimiento: fechaFormateada })
  }

  getAllVendedores() {
    this.vendedoresService.getAll().subscribe((data: ServiceResponse) => {
      this.dataListVendedores = data.data;
    })
  }
// El metodo calcular calcula los totales del proudcto que se esta agregando
  calcular() {
    if (this.miFormulario.value.cantidad > 0 && this.miFormulario.value.cantidad !== "" && this.miFormulario.value.descuento !== "") {
      this.cantidad = this.miFormulario.value.cantidad;
      this.precio = this.miFormulario.value.precio;
      this.subTotal = this.cantidad * this.precio;
      this.impuestos =  this.impuestoProduct*this.cantidad;

      this.descuento = (this.miFormulario.value.descuento / 100) * this.subTotal;
     
      this.total = this.subTotal + (this.impuestoProduct * this.cantidad) - this.descuento;
      this.miFormulario.patchValue({ subTotalDetails: this.subTotal, total: this.total, impuesto : this.cantidad==1? this.impuestoProduct :  this.impuestoProduct*this.cantidad  })
    }
    else {
      this.miFormulario.patchValue({descuento : 0, cantidad : 1, impuesto : this.impuestoProduct});
      console.log()
    }
  }



   contador =0;
   calculoGeneral() {
    let a=0; let b=0; let e=0; let i = 0;
    this.dataListDetalleFactura.forEach(c=>{
      a+=c.subTotal;
      b+=c.descuento;
      e+=c.total;
      i+=c.impuestos;
   })
    this.subTotalGeneral =a;
    this.descuentoGeneral = b;
    this.totalGeneral=e;
    this.totalApagar = e;
    this.impuestosGenerales = i;
  
    if (this.dataListDetalleFactura.length < 1) {
      this.subTotalGeneral = 0;
      this.descuentoGeneral = 0;
      this.totalGeneral = 0;
      this.totalApagar =  0;
      this.cambio = 0;
      this.impuestosGenerales = 0;
    }
  }


  resetDetails() {
    this.cantidad = 1;
    this.precio = 0;
    this.subTotal = 0;
    this.impuestos = 0;
    this.total = 0;
    this.descuento = 0;
    this.dataListProductosSearch = [];
   // this.dataListImpuestosDetails = [];
    this.dataListContactos =[];
    this.idProducto=0;
    this.miFormulario.patchValue({precio : 0, descuento: 0, subTotalDetails : 0, impuesto : 0, total : 0, producto : "", cantidad : 1 })
  }




  editRow(item: iDetalleFactura, index: number) {

    if (this.editando == true) {
      this.alertaService.warnigAlert("Esta editando una fila, debe finalizar una edicion para afectar otro registro.");
    }
    else {
      this.prodcutoSeleccionado = item.productoObj;
      this.editando = true;
      this.idProducto =  item.idProducto;
      this.searchProductoEdit(item.nombre, item.cantidad);
      this.calcular();
      this.miFormulario.patchValue({
        cantidad: item.cantidad,
        descuento: this.descuentoPorcentual,
        precio: item.precio,
        subTotal: item.subTotal,
        subTotalDetails :  item.subTotal,
        total: item.total
      })
      this.selectProductoById(item.producto, item.impuestoObj);
      this.dataListDetalleFactura.splice(index, 1);
      this.calculoGeneral();
      

    }
    

  }

  guardarFactura() {
   
    this.miFormulario.patchValue(
      {
        detalle: this.dataListDetalleFactura,
        idEmpresa: this.usuarioService.usuarioLogueado.data.sucursal.idEmpresa,
        idSucursal: this.usuarioService.usuarioLogueado.data.sucursal.idSucursal,
        idUsuario: this.usuarioService.usuarioLogueado.data.idUsuario,
        descuento: this.descuentoGeneral,
        subTotal: this.subTotalGeneral,
        totalGeneral: this.totalGeneral,
        itbis :  this.impuestosGenerales, 
        impuestos: this.miFormulario.value.impuestoObjet 
      })

    if (this.miFormulario.valid && this.dataListDetalleFactura.length>0) {
      this.alertaService.ShowLoading();
      if(this.miFormulario.value.idFactura!==null)
      {
        this.facturaServcie.update(this.miFormulario.value).subscribe((data: ServiceResponse) => {
          if (data.status) {
            this.alertaService.successAlert(data.message);
            this.resetHeader();
            this.resetDetails();
            this.resetFormPago()
          }
          else {
            this.alertaService.errorAlert(data.message);
          }
  
        })
      }
      else
      {
        
        this.facturaServcie.insert(this.miFormulario.value).subscribe((data: ServiceResponse) => {
          if (data.status) {
            this.alertaService.successAlert(data.message);
            this.resetHeader();
            this.resetDetails();
            this.resetFormPago()
          }
          else {
            this.alertaService.errorAlert(data.message);
          }
  
        })
      }

      
    }
    else {
      this.alertaService.warnigAlert("Debe completar todos para poder guardar el documento");
    }
  }


  //Este metodo siver para limpiar todo despues de hacer un insercion
  resetData() {
    this.resetDetails();
  }
  resetHeader()
  {
    this.dataListDetalleFactura=[];
    this.miFormulario.patchValue({
      cantidad: 1,
      precio: 0,
      subTotalDetails: 0,
      impuesto: 0,
      descuento: 0,
      total: 0,
      producto: "",
      comenatrios : "",
      telefono : "",
      identificacion : "",
      idContacto : "",
      nombreClienteCompleto: "",
      comentario : "",
      idFactura: null
      
    })
    this.totalGeneral=0;
    this.subTotalGeneral=0;
    this.descuentoGeneral=0;
    this.dataListImpuestosDetails=[];
    this.facturaServcie.facturaEdit=null;
  }

  setMetodoPago(metodo :  number,  descripcion : string, index : number){
    this.firstFormGroup.patchValue({firstCtrl : 'metodo'})
    this.metodoPagoSeleccionado = descripcion;
    this.setActive(index);

  }

  validSetFirsForm(){
    if(this.firstFormGroup.invalid){
      this.alertaService.warnigAlert('Seleccione un metodo de pago');
    } 
  }
  activeIndex: number | null = null;
  
  setActive(index: number) {
    this.activeIndex = index;
  }

  calcularPagoEfectivo(event : any){
     this.cambio =this.totalApagar -event.target.value;
     let totalRecibido = event.target.value; 
     this.addMontoPagar(event);
     if(this.cambio<0)
      {
        this.descripcionPago="CAMBIO" 
        this.cambio = (this.cambio * -1)
        this.miFormulario.patchValue({cambio : this.cambio, totalRecibido : event.target.value, montoPagado : event.target.value  })
      }
      else
      {
        this.descripcionPago="POR PAGAR" 
      } 
  }

  getAllBancos(){
    this.bancoService.getAll(this.usuarioService.usuarioLogueado.data.sucursal.idSucursal).subscribe((c: ServiceResponse)=>
    {
        this.dataListBancos = c.data;
        
    }
    )
  }

  addMontoPagar(event : any){
    event.target.value.length>0? this.miFormulario.patchValue({montoPagado : this.efectivo}) : 0;
  }

  resetFormPago(){
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.metodoPagoSeleccionado ='';
    this.closeModal();
  }

  pagarFactura(){
    this.secondFormGroup.valid===true? this.guardarFactura() : this.alertaService.warnigAlert("Debe completar los campos para poder aplicar el pago y guardar la factura.") 
  }
  closeModal() {
    console.log('cerrando')
    $('#exampleModal').modal('hide');
  }

  openModal() {
    console.log('cerrando')
    $('#exampleModal').modal('show');
  }
  
  
}

