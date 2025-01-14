import { Component, afterNextRender } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { ServiceResponse } from '../../interfaces/service-response-login';
import { NumeracionesComponent } from '../configuraciones/components/numeraciones/numeraciones.component';
import { material } from '../utilities/material/material';
import { FacturaService } from '../../services/factura.service';
import { InformationService } from '../../services/information.service';
var $ : any;

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    RouterLink,
    material
  ],
  templateUrl: './layout.component.html', 
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  constructor(private usuarioService : UsuarioService, private facturaService : FacturaService, private router: Router, private information : InformationService)
  {
    if(usuarioService.usuarioLogueado!=null)  {
        this.usuario = usuarioService.usuarioLogueado.data;
        this.nombreCompleto= this.capitalizeInitials(`${this.usuario.nombre} ${this.usuario.apellidos}`);
        this.rol =usuarioService.usuarioLogueado.data.rol.nombre;
      }
  }

 capitalizeInitials(str: any) {
    return str.toLowerCase().split(' ').map((word: any) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  closeModal()
  {

    // $('#modalMenu').modal('hide') 
   
  }
  statusModal =  false;
  usuario! : any;
  nombreCompleto!: any;
  rol !: any;
  listIngresos : boolean =false;
  listInventario : boolean =false;

  showListVentas(){
    this.listIngresos==false? this.listIngresos=true : this.listIngresos=false;
  }

  showListInventario(){
    this.listInventario==false? this.listInventario=true : this.listInventario=false;
  }

  test(){ 
    const hamBurger = document.querySelector(".toggle-btn");
    document.querySelector("#sidebar")?.classList.toggle("expand");  
    setTimeout(() => {
      const hamBurger = document.querySelector(".toggle-btn");
    document.querySelector("#sidebar")?.classList.toggle("expand");  
    }, 30000);
  } 


  selectDocument(tipoDocument : string){
    this.facturaService.document = tipoDocument;
    this.information.tipoDocumento = tipoDocument;
    localStorage.setItem("tipoDocumento", tipoDocument);
  if(tipoDocument==="Cotización"){
    this.router.navigate(['layout/cotizaciones']); 
  }
  else {
    this.router.navigate(['layout/facturas']); 
  }
}


    
}

