import { Component } from '@angular/core';
import { importaciones } from '../../../utilities/material/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertServiceService } from '../../../utilities/alert-service.service';
import { MsjService } from '../../../utilities/msj.service';
import { ProductoService } from '../../../../services/producto.service';
import { iContactoPos, iTermino, iVendedor, idNumeracion, idTipoContacto } from '../../../../interfaces/iTermino';
import { ThemePalette } from '@angular/material/core';
import { ServiceResponse } from '../../../../interfaces/service-response-login';
declare var $: any;
@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [
    importaciones
  ],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent {
  constructor(
    private fb: FormBuilder,
    private alertaService: AlertServiceService,
    private msjService: MsjService,
    private productoService : ProductoService,

  ) {

    this.getAll();  
    // this.getAllTipoContacto();
    this.getAllTipoNumeracion();
    this.getAllTerminos();
    this.getAllVendedores();
  }

  miFormulario: FormGroup = this.fb.group(
    {
      idContacto: this.fb.control(null),
      idTipoContacto: this.fb.control("", Validators.required),
      tipoIdentificacion: this.fb.control("", Validators.required),
      rnc: this.fb.control("", Validators.required),
      nombreRazonSocial: this.fb.control("", Validators.required),
      direccion: this.fb.control(""),
      correo: this.fb.control("", Validators.email),
      celular: this.fb.control("", Validators.required),
      telefono1: this.fb.control(""),
      telefono2: this.fb.control(""),
      idTipoNumeracion: this.fb.control(""),
      limiteCredito: this.fb.control(0),
      idVendedor: this.fb.control(""),
      idTermino : this.fb.control(""),
      incluirEstadoCuenta: this.fb.control(false)
    });


  tipoIdentificacion =[
    {nombre : "RNC"},
    {nombre : "Cedula"},
    {nombre : "Pasaporte"},
  ]
  dataListVendedor : iVendedor[]=[];
  dataListTerminos : iTermino[]=[];
  dataListTipoNumeracion : idNumeracion[]=[];
  dataList: iContactoPos[] = [];
  dataListFilter: iContactoPos[] = [];
  dataListTipoContacto : idTipoContacto[]=[];
  cargando: boolean = false;
  sinRegistros: boolean = false;
  sinRegistrosTxt: string = this.msjService.msjSinRegistros;
  checked = false;
  color: ThemePalette = 'primary';
  disabled = false;
  documentoSeleccionado: any = "";

  closeModal() { $("#exampleModal").modal('hide'); }


  insert() {
console.log(this.miFormulario.value)
    this.alertaService.ShowLoading();
    this.productoService.insert(this.miFormulario.value).subscribe((data: ServiceResponse) => {
      setTimeout(() => {
        this.alertaService.successAlert(data.message);
        if (data.status) {
          this.resetForm();
          this.getAll();
          this.closeModal();
        }
      }, 1000);
    })
  }
  async delete(id: any) {
    if (await this.alertaService.questionDelete()) {
      this.alertaService.ShowLoading();
      this.productoService.delete(id).subscribe(((data: ServiceResponse) => {
        if (data.status) {
          this.alertaService.successAlert(data.message);
          this.getAll();
          this.resetForm();
        }
        else {
          this.alertaService.errorAlert(data.message)
        }
      }))
    }



  }
  editar(contacto: iContactoPos) {

    this.miFormulario.reset(contacto)
    // this.miFormulario.patchValue(
    //   {
    //     'idContacto' : contacto.idContacto,
    //     'idTipoContacto': contacto.idTipoContacto,
    //     'tipoIdentificacion': contacto.tipoIdentificacion,
    //     'rnc': contacto.rnc,
    //     'nombreRazonSocial': contacto.nombreRazonSocial,
    //     'direccion': contacto.direccion,
    //     'correo': contacto.correo,
    //     'celular': contacto.celular,
    //     'telefono1': contacto.telefono1.nuemracionSiguiente,
    //     'telefono2': numeracion.numeracionFinal,
    //     'idTipoNumeracion': numeracion.prefijo,
    //     'limiteCredito': numeracion.numeracionInicial,
    //     'idTermino': numeracion.nuemracionSiguiente,
    //     'idVendedor': numeracion.numeracionFinal,
    //     incluirEstadoCuenta

    //   })
    
  }

  update() {
    this.alertaService.ShowLoading();
    this.productoService.update(this.miFormulario.value).subscribe((data: ServiceResponse) => {
      setTimeout(() => {
        this.alertaService.successAlert(data.message);
        data.status ? this.resetForm : '';
        this.getAll();
        this.closeModal();
      }, 1000);
    })
  }

  save() {
    
    if (this.miFormulario.valid) {
      this.miFormulario.get('idContacto')?.value === null ? this.insert() : this.update()
    }
  }

  getAll() {
    this.cargando = true;
    this.productoService.getAll().subscribe((data: any) => {
      this.dataList = data.data;
      if (this.dataList.length > 0) {
        this.sinRegistros = false
        this.cargando = false;
      }
      else {
        this.sinRegistros = true;
        this.cargando = false;
      }
    })
  }
  // getAllFilter(event : any) {
  //   const filtro = (event.target as HTMLInputElement).value;
  //   if(filtro=="")
  //     {
  //       this.getAll();
  //     }
  //     else{
  //       this.cargando = true;
  //       this.productoService.getAllFilter(filtro).subscribe((data: any) => {
  //         this.dataList = data.data;
  //         if (this.dataList.length > 0) {
  //           this.sinRegistros = false
  //           this.cargando = false;
  //         }
  //         else {
  //           this.sinRegistros = true;
  //           this.cargando = false;
  //         }
  //       })
  //     }
   
  // }

  // getAllFilterByTipo(idTipo : number) {
  //   this.cargando = true;
  //   this.productoService.getByIdTipo(idTipo).subscribe((data: any) => {
  //     this.dataList = data.data;
  //     if (this.dataList.length > 0) {
  //       this.sinRegistros = false
  //       this.cargando = false;
  //     }
  //     else {
  //       this.sinRegistros = true;
  //       this.cargando = false;
  //     }
  //   })
  // }


  // getAllTipoContacto()
  // {
  //   this.productoService.getAllTipoContacto().subscribe((response: ServiceResponse)=>
  //   {
  //     if(response.status)
  //       {
  //         this.dataListTipoContacto = response.data;
  //       }
  //   })
  // }

  getAllTipoNumeracion()
  {
    this.productoService.getAll().subscribe((response: ServiceResponse)=>
    {
      if(response.status)
        {
          this.dataListTipoNumeracion = response.data.filter((c: any)=>c.idTipoDocumento==1);
        }
    })
  }

  
  getAllTerminos()
  {
    this.productoService.getAll().subscribe((response: ServiceResponse)=>
    {
      if(response.status)
        {
          this.dataListTerminos = response.data;
        }
    })
  }

   
  getAllVendedores()
  {
    this.productoService.getAll().subscribe((response: ServiceResponse)=>
    {
      if(response.status)
        {
          console.log(response)
          this.dataListVendedor = response.data;
        }
    })
  }

  resetForm() {
    this.miFormulario.reset();
    this.closeModal();
  }

  // filterContact(value : number)
  // {
  //     value==0? this.getAll(): this.getAllFilterByTipo(value);
  // }
  
  
}
