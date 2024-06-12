import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertServiceService } from '../../../utilities/alert-service.service';
import { MarcasService } from '../../../../services/marcas.service';
import { ModelosService } from '../../../../services/modelos.service';
import { iMarca, iModeloGet } from '../../../../interfaces/iTermino';
import { ServiceResponse } from '../../../../interfaces/service-response-login';
import { importaciones } from '../../../utilities/material/material';
declare var $: any;
@Component({
  selector: 'app-modelos',
  standalone: true,
  imports: [importaciones],
  templateUrl: './modelos.component.html',
  styleUrl: './modelos.component.css'
})
export class ModelosComponent {

  constructor(
    private fb: FormBuilder,
    private alertaService: AlertServiceService,
    private marcaSwervice: MarcasService,
    private modeloService : ModelosService
  ) {
    this.getAll();
    this.getAllMarcas();
  }
  miFormulario: FormGroup = this.fb.group(
    {
      idModelo: this.fb.control(null),
      idMarca: this.fb.control(null, Validators.required),
      nombre: this.fb.control("", Validators.required),
    }
  )
  dataList: iModeloGet[] = [];
  dataListMarcas : iMarca[]=[]; 
  cargando : boolean = false;
  sinRegistros : boolean = false;
  
  closeModal() {

    $("#exampleModal").modal('hide');
  }


  insert() {
    this.alertaService.ShowLoading();
    this.modeloService.insert(this.miFormulario.value).subscribe((data: ServiceResponse) => {
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
        this.modeloService.delete(idRol).subscribe(((data: ServiceResponse)=>
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
    this.modeloService.update(this.miFormulario.value).subscribe((data: ServiceResponse) => {
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
      this.miFormulario.get('idModelo')?.value === null ? this.insert() : this.update()
    }
  }

  getAll() {
    this.cargando=true;
    this.modeloService.getAll().subscribe((data: any) => {
      this.dataList = data.data;
      this.dataList.length>0 ? this.sinRegistros=false : this.sinRegistros=true;
      this.cargando=false;
    })
  }

  editar(modelo: any) {
    this.miFormulario.patchValue(
      {'idModelo': modelo.idModelo, 'idMarca' : modelo.marca.idMarca, 'nombre': modelo.nombre, });
    console.log(this.miFormulario.value)
  }

  resetForm() {
    this.miFormulario.reset();
    this.closeModal();
  }

  getAllMarcas ()
  {
    this.marcaSwervice.getAll().subscribe((data: ServiceResponse)=>
    {
      this.dataListMarcas= data.data;
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
        this.modeloService.getAllFilter(filtro).subscribe((data: any) => {
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
