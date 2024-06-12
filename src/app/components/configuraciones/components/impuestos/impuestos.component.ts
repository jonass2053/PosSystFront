import { Component } from '@angular/core';
import { importaciones, material } from '../../../utilities/material/material';
import { ValidatorFormService } from '../../../utilities/validator-form.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertServiceService } from '../../../utilities/alert-service.service';
import { ImpuestosService } from '../../../../services/impuestos.service';
import { iiMpuesto } from '../../../../interfaces/iTermino';
import { ServiceResponse } from '../../../../interfaces/service-response-login';
declare var $: any;

@Component({
  selector: 'app-impuestos',
  standalone: true,
  imports: [
    importaciones,
    material
  ],
  templateUrl: './impuestos.component.html',
  styleUrl: './impuestos.component.css'
})
export class ImpuestosComponent {
  constructor(
    private fb: FormBuilder,
    private validatorForm: ValidatorFormService,
    private alertaService: AlertServiceService,
    private impuestoService: ImpuestosService
  ) {
    this.getAll();
  }
  miFormulario: FormGroup = this.fb.group(
    {
      idImpuesto: this.fb.control(null),
      nombre: this.fb.control("", Validators.required),
      porcentaje: this.fb.control(0),
      impuestoAcreditable: this.fb.control(false),
      descripcion: this.fb.control("")
    }
  )
  dataList: iiMpuesto[] = [];
  cargando: boolean = false;
  sinRegistros: boolean = false;

  closeModal() {

    $("#exampleModal").modal('hide');
  }


  insert() {
    this.alertaService.ShowLoading();
    this.impuestoService.insert(this.miFormulario.value).subscribe((data: ServiceResponse) => {
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
  async delete(idImpuesto: any) {
    if (await this.alertaService.questionDelete()) {
      this.alertaService.ShowLoading();
      this.impuestoService.delete(idImpuesto).subscribe(((data: ServiceResponse) => {
        if (data.status) {
          this.alertaService.successAlert(data.message);
          this.getAll();
        }
        else {
          this.alertaService.errorAlert(data.message)
        }
      }))
    }



  }

  update() {
    this.alertaService.ShowLoading();
    this.impuestoService.update(this.miFormulario.value).subscribe((data: ServiceResponse) => {
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
      this.miFormulario.get('idImpuesto')?.value === null ? this.insert() : this.update()
    }
  }

  getAll() {
    this.cargando = true;
    this.impuestoService.getAll().subscribe((data: any) => {
      this.dataList = data.data;
      this.dataList.length > 0 ? this.sinRegistros = false : this.sinRegistros = true;
      this.cargando = false;
    })
  }

  editar(impuesto: iiMpuesto) {
    this.miFormulario.patchValue({
     'idImpuesto': impuesto.idImpuesto,
     'nombre': impuesto.nombre,
     'porcentaje': impuesto.porcentaje,
     'impuestoAcreditable': impuesto.impuestoAcreditable,
     'descripcion': impuesto.descripcion
    }
    )
  }

  resetForm() {
    this.miFormulario.reset();
    this.closeModal();
  }

}
