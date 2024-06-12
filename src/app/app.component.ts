import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UsuarioService } from './services/usuario.service';
import { json } from 'stream/consumers';
import { log } from 'console';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [

  RouterOutlet,
  MatFormFieldModule,
  CommonModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  ReactiveFormsModule,
  RouterLink,
  MatFormFieldModule,
  MatInputModule,
  
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PosSystem';

  constructor(private usuario : UsuarioService){
    //console.log(document.defaultView?.localStorage.getItem('user'))
    // let text = document.defaultView?.localStorage.getItem('user');
    // console.log(localStorage.getItem('user'))
    // if()
    //   {
    //  
    //   }
    if (typeof document !== 'undefined') {

     usuario.usuarioLogueado = JSON.parse(document.defaultView?.localStorage.getItem('user')!);

  }
 
  }


}
