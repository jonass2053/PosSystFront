import { Component } from '@angular/core';
import { MY_DATE_FORMATS, importaciones } from '../../../utilities/material/material';
import { iContactoPos, iDetalleFactura, iMoneda, iProducto, iTermino, iVendedor, idNumeracion, iiMpuesto } from '../../../../interfaces/iTermino';
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
import {DatePipe} from '@angular/common';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { VendedoresService } from '../../../../services/vendedores.service';
import { ProductoService } from '../../../../services/producto.service';
import { totalmem } from 'os';
import { log } from 'console';


@Component({
  selector: 'app-factura',
  standalone: true,
  imports: [
    importaciones,

    
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
    provideNativeDateAdapter(), DatePipe,
    
  ],
  templateUrl: './factura.component.html',
  styleUrl: 'factura.component.css'
})
export class FacturaComponent {

  constructor(
    private usuarioService : UsuarioService,
    private alertaService: AlertServiceService,
    private contactoService : ContactosService,
    private plazoService : TerminosService,
    private fb : FormBuilder,
    private numeracionService : NumeracionService,
    private datePipe : DatePipe,
    private vendedoresService : VendedoresService,
    private productoService : ProductoService
  )
  {
    if(this.usuarioService.usuarioLogueado!=undefined)
      {
        this.moneda = this.usuarioService.usuarioLogueado.data.sucursal.empresa.moneda;
      }
      this.miFormulario.patchValue({fecha : new Date()})
      console.log(this.miFormulario.value)
      this.getAllTerminos();  
      this.getAllNumeracion();
      this.getAllVendedores();
  }
  
  miFormulario : FormGroup = this.fb.group({
    idFactura : this.fb.control(""),
    idNumeracion :  this.fb.control("", Validators.required),
    idContacto :  this.fb.control("", Validators.required),
    idTermino : this.fb.control("", Validators.required),
    idVendedor : this.fb.control(null),
    identificacion : this.fb.control(""),
    vencimiento : this.fb.control(""),
    telefono :  this.fb.control("", Validators.required),
    fecha : this.fb.control(""),
    descripcion : this.fb.control({value : "", disabled : true}),
    precio : this.fb.control({value : 0, disabled : false}),
    cantidad : this.fb.control(1),
    descuento : this.fb.control({value : 0, disabled : false}),
    impuesto : this.fb.control(0),
    producto :  this.fb.control(''),
    impuestoObjet : this.fb.control(""),
    subTotalDetails: this.fb.control(0),
    total : this.fb.control(0),

  })

  idProducto! : number;
  nombre : string="";
  cantidad : number=0;
  precio : number =0;
  descuento : number=0;
  impuestos : number =0;
  subTotal : number=0;
  total : number=0;
  identificacion : string= "jonas dia";   
  telefono : string ="";  
  dataListNumeracion : idNumeracion[]=[];
  dataListVendedores : iVendedor []=[];
  dataListDetalleFactura :iDetalleFactura[]  =[];
  DetalleFactura : iDetalleFactura = { idDetalleFactura : 0, nombre :"",  idFactura : 0,  idProducto: 0, cantidad: 0, precio: 0, subTotal :0, descuento: 0, impuestos: 0, total: 0};
  
  moneda! : iMoneda;
  dataListTerminos : iTermino[]=[];
  dataListContactos : iContactoPos[]=[]; 
  dataListProductosSearch : iProducto[]=[];
  fechaVenvimiento : any;


   addDetails(){
  if(this.miFormulario.value.total==0 && this.miFormulario.value.cantidad!="")
    {
      this.alertaService.warnigAlert("Debe seleccionar un item y llenar los campos para poder agregar.")
    }
    else
    {
       let detalle  : iDetalleFactura = {
       nombre : this.nombre
      ,idProducto : this.idProducto
      ,idDetalleFactura : 0
      ,cantidad : this.cantidad
      ,precio : this.precio
      ,descuento : this.descuento
      ,subTotal : this.subTotal
      ,impuestos:this.impuestos
      ,total : this.total
      }
      this.dataListDetalleFactura.push(detalle)
      this.resetDetails();
    }
 
}
removeItem(indice : number)
{
  this.dataListDetalleFactura.splice(indice, 1);
}

searchContacto(event : any)
{
  let valor  = (event.target as HTMLInputElement).value;
  if(valor.length>0)
    {
      this.contactoService.getAllFilter((event.target as HTMLInputElement).value).subscribe((data: ServiceResponse)=>
        {
            this.dataListContactos = data.data.filter((c:iContactoPos)=>c.idTipoContacto!=2);
            console.log( this.dataListContactos)
        })
    }
}

searchProducto(event : any)
{
  let valor  = (event.target as HTMLInputElement).value;
  if(valor.length>0)
    {
      this.productoService.getAllFilterForDocument((event.target as HTMLInputElement).value).subscribe((data: ServiceResponse)=>
        {
          console.log(data.data)
            this.dataListProductosSearch = data.data;
        })
    }
}


displayFn(contacto?: iContactoPos): string | undefined | any {
  return contacto ? contacto.nombreRazonSocial : undefined;
}

displayFnProducto(producto?: iProducto): string | undefined | any {
  return producto ? producto.nombre : undefined;
}

selectContacto(event : any)
{

  this.miFormulario.patchValue({identificacion : event.option.value.rnc, telefono  : event.option.value.telefono1, idNumeracion : event.option.value.idTipoNumeracion})
  
}

selectProducto(event : any)
{
  this.idProducto = event.option.value.idProducto;
  this.nombre = event.option.value.nombre;
  this.miFormulario.patchValue(
    {
     cantidad : this.miFormulario.value.cantidad,   
     descripcion : event.option.value.descripcion,
     precio  : event.option.value.precioBase,
     impuestoObjet : event.option.value.impuestos
    })
    this.calcular();
}


getAllTerminos(){
   this.plazoService.getAll().subscribe((data: ServiceResponse)=>
  {
    this.dataListTerminos = data.data;
    let dateNow =  new Date();
    this.miFormulario.patchValue({idTermino : data.data.find((c:iTermino)=>c.predeterminado==true).idTermino})
    this.setVencimiento();
  })
}


calVencimiento(fecha : Date, dias : any){   
   return addDays(this.miFormulario.value.fecha, dias);  
}

getAllNumeracion(){
  this.numeracionService.getAll().subscribe((data: ServiceResponse)=>
  {
    this.dataListNumeracion = data.data;
    this.miFormulario.patchValue({"idNumeracion" : (data.data.find((c: idNumeracion)=>c.predeterminada==true)).idNumeracion})
  })
}

setVencimiento(){
  let dias = this.dataListTerminos.find((c: iTermino)=>c.idTermino==this.miFormulario.value.idTermino)?.dias;
  let fechaVencimiento = this.calVencimiento(this.miFormulario.value.fecha, dias);
  let fechaFormateada = this.datePipe.transform(fechaVencimiento, 'dd-MM-yyyy');
  this.miFormulario.patchValue({vencimiento : fechaFormateada})
}

getAllVendedores(){
  this.vendedoresService.getAll().subscribe((data: ServiceResponse)=>{
    this.dataListVendedores = data.data;
  })
} 

calcular(){
  if(this.miFormulario.value.cantidad>0 && this.miFormulario.value.cantidad!=="" && this.miFormulario.value.descuento!==""){
     this.cantidad = this.miFormulario.value.cantidad;
     this.precio = this.miFormulario.value.precio;
     this.subTotal =this.cantidad * this.precio;
     this.descuento = (this.miFormulario.value.descuento/100) * this.subTotal;
     this.impuestos =0;
     this.miFormulario.value.impuestoObjet.forEach((imp : iiMpuesto) => {
     this.impuestos+=((imp.porcentaje/100) * 100); 
     console.log(this.impuestos) 
     }); 
     this.impuestos = (this.impuestos /100) * this.subTotal;
     this.total = this.subTotal + this.impuestos - this.descuento;
     this.miFormulario.patchValue({impuesto : this.impuestos, subTotalDetails : this.subTotal, total : this.total})
    } 
    else{
      this.miFormulario.value.descuento=0;
      this.resetDetails();
    }
}
resetDetails(){
  this.cantidad = 1;
  this.precio = 0
  this.subTotal =0  
  this.impuestos = 0;
  this.total =0; 
  this.descuento =0;
  this.miFormulario.patchValue({
    cantidad : 1,
    precio : 0,
    subTotalDetails : 0,
    impuesto : 0,
    descuento : 0,
    total : 0,
    producto : ""
  })

 this.dataListProductosSearch = [];
}
}

