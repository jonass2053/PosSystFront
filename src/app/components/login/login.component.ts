import { Component, OnInit } from '@angular/core';
import { importaciones } from '../utilities/material/material';

import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceResponseLogin } from '../../interfaces/service-response-login';

import { AlertServiceService } from '../utilities/alert-service.service';
import { InformationService } from '../../services/information.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports : [
    importaciones
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(
    private routess: Router,
    private usuario: UsuarioService,
    private fb: FormBuilder,
    private alertasService: AlertServiceService,
    private information : InformationService) { }
    alerta : Boolean = true;
    mensaje : string = "";

  miFormulario: FormGroup = this.fb.group(
    {
      correo: this.fb.control("admin@gmail.com", Validators.required),
      contrasena: this.fb.control("admin", Validators.required),
    },

  )

  login(): any {
    if (this.miFormulario.valid) {
      this.alertasService.ShowLoading();
      this.usuario.login(this.miFormulario.value).subscribe((data: ServiceResponseLogin) => {
        
        if(data.status == true)
          {    
            this.alerta = false;
            this.usuario.usuarioLogueado = data;  
            this.information.idEmpresa =data.data.sucursal.idEmpresa; 
            localStorage.setItem('user', JSON.stringify(data))
            document.defaultView?.localStorage.setItem('token', JSON.stringify(data.token))
            this.routess.navigate(['/layout'])
            this.alertasService.successAlert(`Bienvenido ${data.data.nombre} ${data.data.apellidos}`);
          }  
          else
          {
            this.alertasService.hideLoading();
            this.mensaje = data.message; 
            this.alerta = true;
           console.log("en el else")
          }
        
      })
    } 
    else {
      this.alertasService.warnigAlert(`Complete los campos`);
    } 
  }






}

