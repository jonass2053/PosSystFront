import { Component } from '@angular/core';
import { importaciones, material } from '../../../utilities/material/material';
import { ValidatorFormService } from '../../../utilities/validator-form.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-impuestos',
  standalone: true,
  imports: [
    importaciones,
    material
  ],
  templateUrl: './impuestos.component.html',
  styleUrl: './impuestos.component.css'
})
export class ImpuestosComponent {
  constructor(private fb : FormBuilder, private validatorForm : ValidatorFormService){}
  miFormulario : FormGroup = this.fb.group(
    {
      idNumeracion : this.fb.control(null),
      tipoDoucmento : this.fb.control("", Validators.required),
      nombre : this.fb.control("", Validators.required),
      numeracionInicial : this.fb.control("", Validators.required),
      fechaVencimiento : this.fb.control("", [Validators.email, Validators.required]),
      predeterminada : this.fb.control("", Validators.required),
    });
    validar(campo: string){return this.validatorForm.validar(this.miFormulario, campo);}

}
