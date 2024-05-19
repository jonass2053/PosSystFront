import { Injectable } from '@angular/core';
import { baseUrl } from '../../enviroment/enviroment.';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { AlertServiceService } from '../components/utilities/alert-service.service';
import { ServiceResponse } from '../interfaces/service-response-login';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  url : string = `${baseUrl}/Categoria`;
constructor(
    private http : HttpClient,
    private fb : FormBuilder,
    private alertas : AlertServiceService
   ) { }
 
   

   insert(formualrio : any) : any
   {
      return this.http.post<ServiceResponse>(`${this.url}`, formualrio).pipe(catchError((error)=>
      {
        console.log(error);
        this.alertas.errorAlert(error);
        return error()
      })
       )
   }
   update(formualrio : any) : Observable<ServiceResponse>
   {
    return this.http.put<ServiceResponse>(`${this.url}`, formualrio)
   }
   delete(id : number) : Observable<ServiceResponse>
   {
    return this.http.delete<ServiceResponse>(`${this.url}/${id}`)
   }
   getAll() : Observable<ServiceResponse>
   {
    return this.http.get<ServiceResponse>(`${this.url}`)
   }

}
