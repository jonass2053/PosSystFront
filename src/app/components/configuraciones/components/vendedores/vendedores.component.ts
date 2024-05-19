import { Component } from '@angular/core';
import { importaciones, material } from '../../../utilities/material/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorFormService } from '../../../utilities/validator-form.service';
import { VendedoresService } from '../../../../services/vendedores.service';
import { AlertServiceService } from '../../../utilities/alert-service.service';
import { MsjService } from '../../../utilities/msj.service';
import { iVendedor } from '../../../../interfaces/iTermino';
import { ThemePalette } from '@angular/material/core';
import { ServiceResponse } from '../../../../interfaces/service-response-login';
declare var $: any;
@Component({
  selector: 'app-vendedores',
  standalone: true,
  imports: [
    importaciones,
    material
  ],
  templateUrl: './vendedores.component.html',
  styleUrl: './vendedores.component.css'
})
export class VendedoresComponent {

  constructor(
    private fb: FormBuilder,
    private validatorForm: ValidatorFormService,
    private vendedoresService: VendedoresService,
    private alertaService: AlertServiceService,
    private msjService: MsjService
  ) {

    this.getAll();
  }
  miFormulario: FormGroup = this.fb.group(
    {
      idVendedor: this.fb.control(null),
      nombre: this.fb.control("", Validators.required),
      rnc: this.fb.control(""),
      observaciones: this.fb.control(""),
     

    });
  dataList: iVendedor[] = [];
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
    this.vendedoresService.insert(this.miFormulario.value).subscribe((data: ServiceResponse) => {
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
      this.vendedoresService.delete(id).subscribe(((data: ServiceResponse) => {
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
    this.vendedoresService.update(this.miFormulario.value).subscribe((data: ServiceResponse) => {
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
      this.miFormulario.get('idVendedor')?.value === null ? this.insert() : this.update()
    }
  }

  getAll() {
    this.cargando = true;
    this.vendedoresService.getAll().subscribe((data: any) => {
      this.dataList = data.data;
      console.log(data.data)
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


  editar(vendedor: iVendedor) {
    this.miFormulario.patchValue(
      {
        'idVendedor' : vendedor.idVendedor,
        'nombre': vendedor.nombre,
        'rnc': vendedor.rnc,
        'observaciones': vendedor.observaciones
      
      })
  }

  resetForm() {
    this.miFormulario.reset();
    this.closeModal();
  }
}
