import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { importaciones, material } from '../../../utilities/material/material';
import { ValidatorFormService } from '../../../utilities/validator-form.service';
import { TerminosService } from '../../../../services/terminos.service';
import { iTermino } from '../../../../interfaces/iTermino';
import { AlertServiceService } from '../../../utilities/alert-service.service';
import { ServiceResponse } from '../../../../interfaces/service-response-login';
import { MsjService } from '../../../utilities/msj.service';
declare var $: any;

@Component({
  selector: 'app-plazo-pagos',
  standalone: true,
  imports: [
    importaciones,
    material,
    
  ],
  templateUrl: './plazo-pagos.component.html',
  styleUrl: './plazo-pagos.component.css'
})
export class PlazoPagosComponent {
  constructor(
    private fb : FormBuilder, 
    private validatorForm : ValidatorFormService,
    private terminoService : TerminosService,
    private alertaService : AlertServiceService,
    private msjService : MsjService
  ){

    this.getAll();
  }
  miFormulario : FormGroup = this.fb.group(
    {
      idTermino : this.fb.control(null),
      nombre : this.fb.control("", Validators.required),
      dias : this.fb.control("", Validators.required),
    });
    dataList: iTermino[] = [];
    cargando : boolean = false;
    sinRegistros : boolean = false;
    sinRegistrosTxt : string =this.msjService.msjSinRegistros;
    
    closeModal() {
  
      $("#exampleModal").modal('hide');
    }


  
    insert() {
      this.alertaService.ShowLoading();
      this.terminoService.insert(this.miFormulario.value).subscribe((data: ServiceResponse) => {
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
     async delete(id : number) 
    {
      if(await this.alertaService.questionDelete())
        {
          this.alertaService.ShowLoading();
          this.terminoService.delete(id).subscribe(((data: ServiceResponse)=>
          {
              if(data.status)
                {
                  this.alertaService.successAlert(data.message);
                  this.getAll();
                  this.resetForm();
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
      this.terminoService.update(this.miFormulario.value).subscribe((data: ServiceResponse) => {
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
        this.miFormulario.get('idTermino')?.value === null ? this.insert() : this.update()
      }
    }
  
    getAll() {
      this.cargando=true;
      this.terminoService.getAll().subscribe((data: any) => {
        this.dataList = data.data;
        (this.dataList.length>0) ? this.sinRegistros=false : this.sinRegistros=true;
        this.cargando=false;
        console.log(data)
      })
    }
  
    editar(termino: iTermino) {
      this.miFormulario.patchValue(
        { 'idTermino': termino.idTermino , 'nombre': termino.nombre, 'dias' : termino.dias })
      console.log(this.miFormulario.value)
    }
  
    resetForm() {
      this.miFormulario.reset();
      this.closeModal();
    }

}
