import { Component } from '@angular/core';
import { ValidatorFormService } from '../../../utilities/validator-form.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { importaciones, material } from '../../../utilities/material/material';
import { ConfiguracionesFactService } from '../../../../services/configuraciones-fact.service';
import { AlertServiceService } from '../../../utilities/alert-service.service';
import { MsjService } from '../../../utilities/msj.service';
import { iConfiguracionFac } from '../../../../interfaces/iTermino';
import { ServiceResponse } from '../../../../interfaces/service-response-login';
import { UsuarioService } from '../../../../services/usuario.service';

@Component({
  selector: 'app-configuracion-factura',
  standalone: true,
  imports: [
    importaciones,
    material
  ],
  templateUrl: './configuracion-factura.component.html',  
  styleUrl: './configuracion-factura.component.css'
})
export class ConfiguracionFacturaComponent {

  constructor(
    private fb : FormBuilder, 
    private configurtacionService : ConfiguracionesFactService,
    private alertaService : AlertServiceService,
    private msjService : MsjService,
    private usuarioService : UsuarioService
  ){
    if(usuarioService.usuarioLogueado.data!=null && usuarioService.usuarioLogueado.data!=undefined)
      {
        this.idEmpresa = usuarioService.usuarioLogueado.data.idEmpresa; 
        this.miFormulario.patchValue({'idEmpresa'  : this.idEmpresa})
        this.getByIdEmpresa(this.idEmpresa);
      }
 
   console.log(this.idEmpresa)
  }
  idEmpresa! : number;
    
  miFormulario : FormGroup = this.fb.group(
    {
      idConfiguracion : this.fb.control(null),
      terminos : this.fb.control(""),
      notas : this.fb.control(""),
      mostrar :  this.fb.control(false),
      idEmpresa : this.fb.control("")
    });
    dataList: iConfiguracionFac[] = [];
    cargando : boolean = false;
    sinRegistros : boolean = false;
    sinRegistrosTxt : string =this.msjService.msjSinRegistros;
  
    insert() {
      this.alertaService.ShowLoading();
      this.configurtacionService.insert(this.miFormulario.value).subscribe((data: ServiceResponse) => {
        setTimeout(() => {
          
          if (data.status) {
            this.alertaService.successAlert(data.message);
            
          }
        }, 1000);
      })
    }
     async delete(id : number) 
    {
      if(await this.alertaService.questionDelete())
        {
          this.alertaService.ShowLoading();
          this.configurtacionService.delete(id).subscribe(((data: ServiceResponse)=>
          {
              if(data.status)
                {
                  this.alertaService.successAlert(data.message);
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
      this.configurtacionService.update(this.miFormulario.value).subscribe((data : ServiceResponse)=>
      {
        setTimeout(() => {
          this.alertaService.successAlert(data.message);
         
        }, 1000);
      })
    }

    getByIdEmpresa(idEmpresa : number)
    {
      

      this.configurtacionService.getByIdEmpresa(idEmpresa).subscribe((data: ServiceResponse)=>
      { console.log(data)
        if(data.status && data.data!=null)
          {
             this.miFormulario.patchValue({
              'idConfiguracion' : data.data.idConfiguracion,
              'terminos' : data.data.terminos,
              'notas' : data.data.notas,
              'mostrar' : data.data.mostrar
             })
           
          }
        
      })
    }
  
    save() {
      
      if (this.miFormulario.valid) {
        console.log(this.miFormulario.value)
        this.miFormulario.get('idConfiguracion')?.value === null ? this.insert() : this.update()
      }
      
    }
}
