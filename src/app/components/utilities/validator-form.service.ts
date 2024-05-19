import { Injectable } from '@angular/core';

import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorFormService {

  constructor() { }

  validar(formulario : FormGroup, campo : string)
  {
    return formulario.get(campo)?.invalid && formulario.get(campo)?.touched;
  }

}
