
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { material } from '../../../utilities/material/material';
import { ValidatorFormService } from '../../../utilities/validator-form.service';
import { AlertServiceService } from '../../../utilities/alert-service.service';

import { UsuarioService } from '../../../../services/usuario.service';
import { IUsuario } from '../../../../interfaces/i-usuario';
import { ServiceResponse, iRol } from '../../../../interfaces/service-response-login';
import { RolesService } from '../../../../services/roles.service';
declare var $: any;


@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    material

  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  constructor(
    private fb : FormBuilder,
    private validatorForm : ValidatorFormService,
    private alertaService : AlertServiceService,
    private usuarioService : UsuarioService ,
    private rolService : RolesService
  ){
    this.getAllRoles();
    this.getAll();
  }
  miFormulario : FormGroup = this.fb.group(
    {
      idUsuario: this.fb.control(null),
      nombre : this.fb.control("", Validators.required),
      apellidos : this.fb.control("", Validators.required),
      correo : this.fb.control("", [Validators.email, Validators.required]),
      idRol : this.fb.control("", Validators.required),
      contrasena : this.fb.control("")
    }

  )
  editando : boolean = false;
  cargando : boolean = false;
  closeModal() {

    $("#exampleModal").modal('hide');
  }

  dataList:IUsuario[] = [];
  roles : iRol[]=[];

  getAllRoles()
  {
    this.rolService.getAll().subscribe((data: ServiceResponse)=>
    {
      this.roles = data.data;
      console.log(data)
    })
  }





  insert() {
    this.alertaService.ShowLoading();
    console.log(this.miFormulario.value)
    this.usuarioService.insert(this.miFormulario.value).subscribe((data: ServiceResponse) => {
    console.log(data)
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
   async delete(usuario : IUsuario) 
  {
    if(await this.alertaService.questionDelete())
      {
        this.alertaService.ShowLoading();
        this.usuarioService.delete(usuario.idUsuario!).subscribe(((data: ServiceResponse)=>
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
    this.usuarioService.update(this.miFormulario.value).subscribe((data: ServiceResponse) => {
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
      console.log(JSON.stringify(this.miFormulario.value))
      this.miFormulario.get('idUsuario')?.value === null ? this.insert() : this.update()
    }
  }

  getAll() {
    this.cargando = true;
    this.usuarioService.getAll().subscribe((data: any) => {
      this.dataList = data.data;
      this.cargando=false;
      console.log(data.data)
    })
  }

  editar(usuario: IUsuario) {
    this.editando=true;
    this.miFormulario.patchValue(
      { 
        'idUsuario': usuario.idUsuario,
         'nombre': usuario.nombre ,
         'apellidos' : usuario.apellidos,
         'correo' : usuario.correo,
         'idRol' : usuario.idRol
        })
  }

  resetForm() {
    this.miFormulario.reset();
    this.editando=false;
    this.closeModal();
  }
  
}
