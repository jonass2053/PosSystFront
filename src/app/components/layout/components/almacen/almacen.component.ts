import { Component } from '@angular/core';
import { iAlmacen } from '../../../../interfaces/iTermino';
import { ServiceResponse } from '../../../../interfaces/service-response-login';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlmacenService } from '../../../../services/almacen.service';
import { AlertServiceService } from '../../../utilities/alert-service.service';
import { importaciones } from '../../../utilities/material/material';
declare var $: any;
@Component({
  selector: 'app-almacen',
  standalone: true,
  imports: [
    importaciones
  ],
  templateUrl: './almacen.component.html',
  styleUrl: './almacen.component.css'
})
export class AlmacenComponent {
  constructor(
    private fb: FormBuilder,
    private alertaService: AlertServiceService,
    private alamcenService: AlmacenService
  ) {
    this.getAll();
  }
  miFormulario: FormGroup = this.fb.group(
    {
      idAlmacen: this.fb.control(null),
      nombre: this.fb.control("", Validators.required),
      observaciones : this.fb.control("")
    }
  )
  dataList: iAlmacen[] = [];
  cargando : boolean = false;
  sinRegistros : boolean = false;
  
  closeModal() {

    $("#exampleModal").modal('hide');
  }


  insert() {
    this.alertaService.ShowLoading();
    this.alamcenService.insert(this.miFormulario.value).subscribe((data: ServiceResponse) => {
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
   async delete(idCategoria : any) 
  {
    if(await this.alertaService.questionDelete())
      {
        this.alertaService.ShowLoading();
        this.alamcenService.delete(idCategoria).subscribe(((data: ServiceResponse)=>
        {
            if(data.status)
              {
                this.alertaService.successAlert(data.message);
                this.getAll();
              }
              else
              {
                this.alertaService.errorAlert(data.message)
              }
        }))
      }



   }
  
  update() {
    this.alertaService.ShowLoading();
    this.alamcenService.update(this.miFormulario.value).subscribe((data: ServiceResponse) => {
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
      console.log(this.miFormulario.value)
      this.miFormulario.get('idAlmacen')?.value === null ? this.insert() : this.update()
    }
  }

  getAll() {
    this.cargando=true;
    this.alamcenService.getAll().subscribe((data: any) => {
      this.dataList = data.data;
      this.dataList.length>0 ? this.sinRegistros=false : this.sinRegistros=true;
      this.cargando=false;
    })
  }

  editar(almacen: iAlmacen) {
    this.miFormulario.patchValue(
      { 'idAlmacen': almacen.idAlmacen, 'nombre': almacen.nombre, 'observaciones' : almacen.observaciones })
    console.log(this.miFormulario.value)
  }

  resetForm() {
    this.miFormulario.reset();
    this.closeModal();
  }
}
