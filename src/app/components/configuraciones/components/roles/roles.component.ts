import { Component, ElementRef, ViewChild, viewChild } from '@angular/core';
import { importaciones, material } from '../../../utilities/material/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertServiceService } from '../../../utilities/alert-service.service';
import { ValidatorFormService } from '../../../utilities/validator-form.service';
import { ServiceResponse, iRol } from '../../../../interfaces/service-response-login';
import { RolesService } from '../../../../services/roles.service';
declare var $: any;

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    importaciones,
    material
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent {
  

  constructor(
    private fb: FormBuilder,
    private validatorForm: ValidatorFormService,
    private alertaService: AlertServiceService,
    private rolService: RolesService
  ) {
    this.getAll();
  }
  miFormulario: FormGroup = this.fb.group(
    {
      idRol: this.fb.control(null),
      nombre: this.fb.control("", Validators.required),
    }
  )
  dataList: iRol[] = [];
  cargando : boolean = false;
  sinRegistros : boolean = false;
  
  closeModal() {

    $("#exampleModal").modal('hide');
  }


  insert() {
    this.alertaService.ShowLoading();
    this.rolService.insert(this.miFormulario.value).subscribe((data: ServiceResponse) => {
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
   async delete(idRol : number) 
  {
    if(await this.alertaService.questionDelete())
      {
        this.alertaService.ShowLoading();
        this.rolService.delete(idRol).subscribe(((data: ServiceResponse)=>
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
    this.rolService.update(this.miFormulario.value).subscribe((data: ServiceResponse) => {
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
      this.miFormulario.get('idRol')?.value === null ? this.insert() : this.update()
    }
  }

  getAll() {
    this.cargando=true;
    this.rolService.getAll().subscribe((data: any) => {
      this.dataList = data.data;
      this.dataList.length>0 ? this.sinRegistros=false : this.sinRegistros=true;
      this.cargando=false;
    })
  }

  editar(rol: iRol) {
    this.miFormulario.patchValue(
      { 'idRol': rol.idRol, 'nombre': rol.nombre })
    console.log(this.miFormulario.value)
  }

  resetForm() {
    this.miFormulario.reset();
    this.closeModal();
  }
}
