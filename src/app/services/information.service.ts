import { Injectable } from '@angular/core';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class InformationService {

  constructor(usuarioService : UsuarioService) { 
    console.log(usuarioService.usuarioLogueado)
  
  }
  idEmpresa: number=0;
  idSucursal : number=0;
  tipoDocumento : string="";



}
