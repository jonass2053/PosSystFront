import { Component } from '@angular/core';
import { importaciones } from '../../../utilities/material/material';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ValidatorFormService } from '../../../utilities/validator-form.service';
import { TerminosService } from '../../../../services/terminos.service';
import { AlertServiceService } from '../../../utilities/alert-service.service';
import { MsjService } from '../../../utilities/msj.service';
import { iBanco, iCuentas, iTermino, iTiopCuentaBanck } from '../../../../interfaces/iTermino';
import { provideNativeDateAdapter, ThemePalette } from '@angular/material/core';
import { ServiceResponse } from '../../../../interfaces/service-response-login';
import { BancosService } from '../../../../services/bancos.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
declare var $ : any;
@Component({
  selector: 'app-bancos',
  standalone: true,
  imports: [
    
    importaciones
  ],
  providers: [provideNativeDateAdapter()],

  templateUrl: './bancos.component.html',
  styleUrl: './bancos.component.css'
})
export class BancosComponent {
  constructor(
    private fb : FormBuilder, 
    private validatorForm : ValidatorFormService,
    private bancoService : BancosService,
    private alertaService : AlertServiceService,
    private msjService : MsjService,
    private usuarioService : UsuarioService
  ){
    
    this.getAll();
    this.getTipoCuenta();
  }
  miFormulario : FormGroup = this.fb.group(
    {
      idBanco :  this.fb.control(null),
      idTipoCuenta : this.fb.control("", Validators.required),
      nombreCuenta :  this.fb.control("", Validators.required),
      numerCuenta : this.fb.control("", Validators.required),
      saldoInicial :  this.fb.control(0, Validators.required),
      fechaSaldoInicial :  this.fb.control("", [Validators.required]),
      descripcion :  this.fb.control(""),
      estado : this.fb.control(""),
      idSucursal :  this.fb.control(null, Validators.required)
    });



    dataListTipoCuenta : iTiopCuentaBanck []=[];
    dataList: iBanco[] = [];
    cargando : boolean = false;
    sinRegistros : boolean = false;
    sinRegistrosTxt : string =this.msjService.msjSinRegistros;
    color: ThemePalette = 'primary';

    closeModal() {
      $("#exampleModal").modal('hide');
    }


  
    insert() {
      this.alertaService.ShowLoading();
      this.bancoService.insert(this.miFormulario.value).subscribe((data: ServiceResponse) => {
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
          this.bancoService.delete(id).subscribe(((data: ServiceResponse)=>
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
      this.bancoService.update(this.miFormulario.value).subscribe((data: ServiceResponse) => {
        setTimeout(() => {
          this.alertaService.successAlert(data.message);
          data.status ? this.resetForm : '';
          this.getAll();
          this.closeModal();
        }, 1000);
      })
    }
  
    save() {
      this.setSucursalToForm();
      if (this.miFormulario.valid) {
        console.log(this.miFormulario.value)
        this.miFormulario.get('idBanco')?.value === null ? this.insert() : this.update()
      }
    }
  
    getAll() {
      this.cargando=true;
      console.log()
      this.bancoService.getAll(this.usuarioService.usuarioLogueado.data.sucursal.idSucursal).subscribe((data: any) => {
        this.dataList = data.data;
        
        (this.dataList.length>0) ? this.sinRegistros=false : this.sinRegistros=true;
        this.cargando=false;
        console.log(data)
      })
    }
  
    editar(cuenta: iBanco) {
      this.miFormulario.patchValue(
        { 
          idBanco :  cuenta.idBanco,
          idTipoCuenta : cuenta.idTipoCuenta,
          nombreCuenta :  cuenta.nombreCuenta,
          numerCuenta : cuenta.numerCuenta,
          saldoInicial :  cuenta.saldoInicial,
          fechaSaldoInicial :  new Date(cuenta.fechaSaldoInicial),
          descripcion :  cuenta.descripcion,
        })
        this.setSucursalToForm();
    }
  
    resetForm() {
      this.miFormulario.reset();
      this.closeModal();
    }

    getTipoCuenta(){
      this.bancoService.getTipoCuenta().subscribe((data : ServiceResponse)=>{
        data.status? this.dataListTipoCuenta =  data.data : "";
      })
    }

    setSucursalToForm(){
      this.miFormulario.patchValue({idSucursal : this.usuarioService.usuarioLogueado.data.sucursal.idSucursal})
    }
}
