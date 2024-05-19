import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertServiceService } from '../components/utilities/alert-service.service';
import { Observable, catchError } from 'rxjs';
import { ServiceResponse } from '../interfaces/service-response-login';
import { baseUrl } from '../../enviroment/enviroment.';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

// private headers : HttpHeaders;
// private header : { headers : HttpHeaders }
//this.headers =  new HttpHeaders({'Authotization' : `Bearer${}`})
url : string = `${baseUrl}/User/role`;
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
