import { Component, OnInit } from '@angular/core';
import { importaciones } from '../utilities/material/material';

import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceResponseLogin } from '../../interfaces/service-response-login';
import { error } from 'console';
import { AlertServiceService } from '../utilities/alert-service.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
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
    private alertasService: AlertServiceService) { }
    alerta : Boolean = true;
    mensaje : string = "";

  miFormulario: FormGroup = this.fb.group(
    {
      correo: this.fb.control("jonass2053@gmail.com", Validators.required),
      contrasena: this.fb.control("123456", Validators.required),
    },

  )

  login(): any {
    if (this.miFormulario.valid) {
      this.alertasService.ShowLoading();
      this.usuario.login(this.miFormulario.value).subscribe((data: ServiceResponseLogin) => {
        if(data.status == true)
          {    
          
     console.log(data.status  )
            this.alerta = false;
            console.log(data);
            this.usuario.usuarioLogueado = data;  
            localStorage.setItem('user', JSON.stringify(data))
            console.log(localStorage.getItem('user'))
            document.defaultView?.localStorage.setItem('token', JSON.stringify(data.token))
            this.routess.navigate(['/layout'])
            this.alertasService.successAlert(`Bienvenido ${data.data.nombre} ${data.data.apellidos}`);
          }  
          else
          {
            this.mensaje = data.message;
            this.alerta = true;
          }
      })
    } 
    else {
      this.alertasService.warnigAlert(`Complete los campos`);
    } 
  }






}

