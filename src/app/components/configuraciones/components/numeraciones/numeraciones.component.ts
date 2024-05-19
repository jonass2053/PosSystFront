import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorFormService } from '../../../utilities/validator-form.service';
import { importaciones, material } from '../../../utilities/material/material';
import { iTipoDocumento, iTipoNumeracion, idNumeracion } from '../../../../interfaces/iTermino';
import { NumeracionService } from '../../../../services/numeracion.service';
import { AlertServiceService } from '../../../utilities/alert-service.service';
import { MsjService } from '../../../utilities/msj.service';
import { ServiceResponse } from '../../../../interfaces/service-response-login';
import {ThemePalette, provideNativeDateAdapter} from '@angular/material/core';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';


declare var $: any;
@Component({
  selector: 'app-numeraciones',
  standalone: true,
  imports: [
    importaciones,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule
  
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './numeraciones.component.html',
  styleUrl: './numeraciones.component.css'
})
export class NumeracionesComponent {

  constructor(
    private fb: FormBuilder,
    private validatorForm: ValidatorFormService,
    private numeracionService: NumeracionService,
    private alertaService: AlertServiceService,
    private msjService: MsjService
  ) {

    this.getAll();
    this.getAllTpoDocumentos()
  }
  miFormulario: FormGroup = this.fb.group(
    {
      idNumeracion: this.fb.control(null),
      idTipoDocumento: this.fb.control("", Validators.required),
      idTipoNumeracion: this.fb.control(""),
      nombre: this.fb.control("", Validators.required),
      predeterminada: this.fb.control(false),
      vigencia: this.fb.control("", Validators.required),
      prefijo: this.fb.control(""),
      numeracionInicial: this.fb.control("", Validators.required),
      nuemracionSiguiente: this.fb.control("", Validators.required),
      numeracionFinal: this.fb.control(""),

    });
  dataList: idNumeracion[] = [];
  dataListTipoDocumentos: iTipoDocumento[] = [];
  dataListTipoNumeracion: iTipoNumeracion[] = [];
  cargando: boolean = false;
  sinRegistros: boolean = false;
  sinRegistrosTxt: string = this.msjService.msjSinRegistros;
  color: ThemePalette = 'primary';
  checked = false;
  disabled = false;
  documentoSeleccionado :  any ="";

  closeModal() {

    $("#exampleModal").modal('hide');
  }



  insert() {
   
    this.alertaService.ShowLoading();
    this.numeracionService.insert(this.miFormulario.value).subscribe((data: ServiceResponse) => {
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
  async delete(id: number) {
    if (await this.alertaService.questionDelete()) {
      this.alertaService.ShowLoading();
      this.numeracionService.delete(id).subscribe(((data: ServiceResponse) => {
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

  update() {
    this.alertaService.ShowLoading();
    this.numeracionService.update(this.miFormulario.value).subscribe((data: ServiceResponse) => {
      setTimeout(() => {
        this.alertaService.successAlert(data.message);
        data.status ? this.resetForm : '';
        this.getAll();
        this.closeModal();
      }, 1000);
    })
  }

  updateStatus(id: number, estado : boolean) {
   
    this.numeracionService.updateStatus(id, estado).subscribe((data: ServiceResponse) => {
      setTimeout(() => {
        // this.alertaService.successAlert(data.message);
        data.status ? this.resetForm : '';
        this.getAll();
       
      }, 1000);
    })
  }

  setNumberDefault(id: number) {
    // this.alertaService.ShowLoading();
    this.numeracionService.setDefautlNumeration(id).subscribe((data: ServiceResponse) => {
      setTimeout(() => {
        // this.alertaService.successAlert(data.message);
        data.status ? this.resetForm : '';
        this.getAll();
        // this.closeModal();
      }, 1000);
    })
  }

  save() {
    if (this.miFormulario.valid) {
      this.miFormulario.get('idNumeracion')?.value === null ? this.insert() : this.update()
    }
  }

  getAll() {
    this.cargando = true;
    this.numeracionService.getAll().subscribe((data: any) => {
      this.dataList = data.data;
      if(this.dataList.length > 0)
        {
          this.sinRegistros = false
          this.cargando = false;
        }
        else
        {
          this.sinRegistros = true;
          this.cargando = false;
        }

     
    })
  }

  getAllTpoDocumentos() {
    this.numeracionService.getAllTipoDocumentos().subscribe((data: any) => {
      this.dataListTipoDocumentos = data.data;
    })
  }

  getTipoNumeracion(id: number) {

    this.numeracionService.getAll().subscribe((data: any) => {
      this.dataList = data.data;
      console.log(data.data)
    })
  }

  editar(numeracion: idNumeracion) {
 
    this.cargarTipoNumeracion(numeracion.idTipoDocumento)
    this.miFormulario.patchValue(
      {
        'idNumeracion' : numeracion.idNumeracion,
        'idTipoDocumento': numeracion.idTipoDocumento,
        'idTipoNumeracion': numeracion.idTipoNumeracion,
        'nombre': numeracion.nombre,
        'predeterminada': numeracion.predeterminada,
        'vigencia': numeracion.vigencia,
        'prefijo': numeracion.prefijo,
        'numeracionInicial': numeracion.numeracionInicial,
        'nuemracionSiguiente': numeracion.nuemracionSiguiente,
        'numeracionFinal': numeracion.numeracionFinal
      })
      console.log(numeracion.idTipoDocumento)
  }

  resetForm() {
    this.miFormulario.reset();
    this.dataListTipoNumeracion =[];
    this.closeModal();
  }

  cargarTipoNumeracion(idTipoDocumento: any)
  {
    this.documentoSeleccionado = this.dataListTipoDocumentos.filter((c:any)=>c.idTipoDocumento===idTipoDocumento)[0].nombre;
      this.numeracionService.getTipoNumeracion(idTipoDocumento).subscribe((response: ServiceResponse)=>
        {
          this.dataListTipoNumeracion = response.data;
        }
      )
  }
  seleccionarTipoNumeracion(tipo : any)
  {
    if(this.documentoSeleccionado.includes("Factura"))
      {
        this.miFormulario.patchValue({"prefijo": tipo.prefijo, "nombre": `Factura  ${tipo.nombre}`})

      }
      else{
        this.miFormulario.patchValue({"prefijo": tipo.prefijo, "nombre": tipo.nombre},)
      }
      
  }
}
