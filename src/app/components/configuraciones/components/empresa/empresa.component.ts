import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { log } from 'console';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { Router } from 'express';
import { ValidatorFormService } from '../../../utilities/validator-form.service';
import { AlertServiceService } from '../../../utilities/alert-service.service';
import { timeout } from 'rxjs';
import { importaciones, material } from '../../../utilities/material/material';
import { iNumEmpleados, iRegimen, iSector } from '../../../../interfaces/iTermino';
import { EmpresaService } from '../../../../services/empresa.service';
import { ServiceResponse } from '../../../../interfaces/service-response-login';
import { MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY } from '@angular/material/select';
import { UsuarioService } from '../../../../services/usuario.service';


@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [
   importaciones,
   material
  ],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.css'
})
export class EmpresaComponent {

  constructor(
    private fb : FormBuilder,
     private validatorForm : ValidatorFormService,
     private alertasService:  AlertServiceService,
     private empresaService : EmpresaService,
     private usuariosService: UsuarioService 
    ){
      this.cargarSector();
      this.cargarRegimen();
      this.cargarEmpresaById();
    }
    numEmpleadosData : iNumEmpleados[]=[
      {value : '1 a 10', name: '1 a 10'},
      {value : '11 a 50', name: '11 a 50'},
      {value : '51 a 100', name: '51 a 100'},
      {value : '101 a 200', name: '101 a 200'},
      {value : 'Más de 200', name: 'Más de 200'},
    ];
    
    

    dataListSector : iSector[]=[];
    dataLisRegimen : iRegimen[]=[];

    
  miFormulario : FormGroup = this.fb.group(
    {
      idEmpresa :  this.fb.control(null),
      razonSocial : this.fb.control("", Validators.required),
      nombreComercial : this.fb.control("", Validators.required),
      rnc : this.fb.control("", Validators.required),
      telefono : this.fb.control(""),
      direccion : this.fb.control(""),
      correo : this.fb.control(""),
      web : this.fb.control("",),
      idRegimen : this.fb.control(""),
      idSector :  this.fb.control(""),
      facturacionElectronica : this.fb.control(false),
      numEmpleados : this.fb.control("")

    }
  )
  validar(campo: string){return this.validatorForm.validar(this.miFormulario, campo);}
  selectedFile: File | undefined;
  imageUrl: string | ArrayBuffer | null = null;
  formData =  new FormData();
  uploadFile(file : File)
  {
    this.formData.append('file',file);
  
  }
  onFileSelected(event: any) {
    this.formData.append('logo',(event.target.files[0] as File))
    this.selectedFile = event.target.files[0] as File;
    this.previewImage();
  }
  previewImage() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
    }
  }
  insert(event : any)
  { 
     this.formData.append('idEmpresa', this.miFormulario.get('idEmpresa')?.value)   
     this.formData.append('razonSocial', this.miFormulario.get('razonSocial')?.value);
     this.formData.append('nombreComercial', this.miFormulario.get('nombreComercial')?.value);
     this.formData.append('direccion', this.miFormulario.get('direccion')?.value);
     this.formData.append('telefono', this.miFormulario.get('telefono')?.value);
     this.formData.append('correo', this.miFormulario.get('correo')?.value);
     this.formData.append('rnc', this.miFormulario.get('rnc')?.value);
     this.formData.append('web', this.miFormulario.get('web')?.value);
     this.formData.append('idRegimen', this.miFormulario.get('idRegimen')?.value);
     this.formData.append('idSector', this.miFormulario.get('idSector')?.value);
     this.formData.append('numEmpleados', this.miFormulario.get('numEmpleados')?.value);
      // this.formData.forEach(c=>{console.log(c)});
    
     this.alertasService.ShowLoading();
     this.empresaService.update(this.formData).subscribe((response: ServiceResponse)=>{
      console.log(response)
      this.alertasService.hideLoading();
     })
      
    }
  

  cargarRegimen()
  {
    this.empresaService.getAllRegimen().subscribe((response : ServiceResponse)=>
    {
      response.data!=null? this.dataLisRegimen = response.data : ""
    })
  }

  cargarSector()
  {
    this.empresaService.getAllSectores().subscribe((response : ServiceResponse)=>
    {
      response.data!=null? this.dataListSector = response.data : ""
    })
  }

  cargarEmpresaById()
  {
    if(this.usuariosService.usuarioLogueado!=undefined)
      {
        this.empresaService.getById(this.usuariosService.usuarioLogueado.data.idEmpresa).subscribe((response: ServiceResponse)=>
          {
            this.miFormulario.reset(response.data)
            this.imageUrl = response.data.logo;
            console.log(this.imageUrl)
          })
      }
   
  }

   

}
