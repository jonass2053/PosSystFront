import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriaService } from '../../../../services/categoria.service';
import { AlertServiceService } from '../../../utilities/alert-service.service';
import { iCategoria } from '../../../../interfaces/iTermino';
import { ServiceResponse } from '../../../../interfaces/service-response-login';
import { importaciones } from '../../../utilities/material/material';
declare var $: any;
@Component({
  selector: 'app-categoria-p',
  standalone: true,
  imports: [
    importaciones
  ],
  templateUrl: './categoria-p.component.html',
  styleUrl: './categoria-p.component.css'
})
export class CategoriaPComponent {
  constructor(
    private fb: FormBuilder,
    private alertaService: AlertServiceService,
    private categoriaService: CategoriaService
  ) {
    this.getAll();
  }
  miFormulario: FormGroup = this.fb.group(
    {
      idCategoria: this.fb.control(null),
      nombre: this.fb.control("", Validators.required),
    }
  )
  dataList: iCategoria[] = [];
  cargando : boolean = false;
  sinRegistros : boolean = false;
  
  closeModal() {

    $("#exampleModal").modal('hide');
  }


  insert() {
    this.alertaService.ShowLoading();
    this.categoriaService.insert(this.miFormulario.value).subscribe((data: ServiceResponse) => {
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
        this.categoriaService.delete(idCategoria).subscribe(((data: ServiceResponse)=>
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
    this.categoriaService.update(this.miFormulario.value).subscribe((data: ServiceResponse) => {
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
      this.miFormulario.get('idCategoria')?.value === null ? this.insert() : this.update()
    }
  }

  getAll() {
    this.cargando=true;
    this.categoriaService.getAll().subscribe((data: any) => {
      this.dataList = data.data;
      this.dataList.length>0 ? this.sinRegistros=false : this.sinRegistros=true;
      this.cargando=false;
    })
  }

  editar(categoria: iCategoria) {
    this.miFormulario.patchValue(
      { 'idCategoria': categoria.idCategoria, 'nombre': categoria.nombre })
    console.log(this.miFormulario.value)
  }

  resetForm() {
    this.miFormulario.reset();
    this.closeModal();
  }
}
