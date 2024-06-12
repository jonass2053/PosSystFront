import { Component } from '@angular/core';
import { iCategoria, iMarca, iMarcaget } from '../../../../interfaces/iTermino';
import { ServiceResponse } from '../../../../interfaces/service-response-login';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarcasService } from '../../../../services/marcas.service';
import { AlertServiceService } from '../../../utilities/alert-service.service';
import { ValidatorFormService } from '../../../utilities/validator-form.service';
import { importaciones } from '../../../utilities/material/material';
import { CategoriaService } from '../../../../services/categoria.service';
declare var $: any;
@Component({
  selector: 'app-marcas',
  standalone: true,
  imports: [
    importaciones
  ],
  templateUrl: './marcas.component.html',
  styleUrl: './marcas.component.css'
})
export class MarcasComponent {

  constructor(
    private fb: FormBuilder,
    private alertaService: AlertServiceService,
    private marcaSwervice: MarcasService,
    private categoriaService : CategoriaService
  ) {
    this.getAll();
    this.getAllCategorias();
  }
  miFormulario: FormGroup = this.fb.group(
    {
      idMarca: this.fb.control(null),
      idCategoria: this.fb.control(null, Validators.required),
      nombre: this.fb.control("", Validators.required),
    }
  )
  dataList: iMarcaget[] = [];
  dataListCategorias : iCategoria[]=[]; 
  cargando : boolean = false;
  sinRegistros : boolean = false;
  
  closeModal() {

    $("#exampleModal").modal('hide');
  }


  insert() {
    this.alertaService.ShowLoading();
    this.marcaSwervice.insert(this.miFormulario.value).subscribe((data: ServiceResponse) => {
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
        this.marcaSwervice.delete(idRol).subscribe(((data: ServiceResponse)=>
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
    this.marcaSwervice.update(this.miFormulario.value).subscribe((data: ServiceResponse) => {
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
      this.miFormulario.get('idMarca')?.value === null ? this.insert() : this.update()
    }
  }

  getAll() {
    this.cargando=true;
    this.marcaSwervice.getAll().subscribe((data: any) => {
      this.dataList = data.data;
      console.log(data.data)
      this.dataList.length>0 ? this.sinRegistros=false : this.sinRegistros=true;
      this.cargando=false;
    })
  }

  editar(marca: any) {
    console.log(marca.categoria.idCategoria)
    this.miFormulario.patchValue(
      {'idMarca': marca.idMarca, 'idCategoria' : marca.categoria.idCategoria, 'nombre': marca.nombre, });
    console.log(this.miFormulario.value)
  }

  resetForm() {
    this.miFormulario.reset();
    this.closeModal();
  }

  getAllCategorias ()
  {
    this.categoriaService.getAll().subscribe((data: ServiceResponse)=>
    {
      this.dataListCategorias= data.data;
    })
  }
  getAllFilter(event : any)
  {
    const filtro = (event.target as HTMLInputElement).value;
    if(filtro=="")
      {
        this.getAll();
      }
      else{
        this.cargando = true;
        this.marcaSwervice.getAllFilter(filtro).subscribe((data: any) => {
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
    
  }
}
