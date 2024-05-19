import { Injectable } from '@angular/core';
import { baseUrl } from '../../enviroment/enviroment.';
import { HttpClient } from '@angular/common/http';
import { AlertServiceService } from '../components/utilities/alert-service.service';
import { ServiceResponse } from '../interfaces/service-response-login';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactosService {

  url : string = `${baseUrl}/Contacto`;
  constructor(
      private http : HttpClient,
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
     getById(id : number) : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${this.url}/${id}`)
     }
     getByIdTipo(id : number) : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${this.url}/getbytipo/${id}`)
     }
     getAll() : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${this.url}`)
     }
     getAllFilter(filter : string) : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${this.url}/getallfilter/${filter}`)
     }
     getAllTipoContacto(): Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${this.url}/tipo-contactos`)
     }
    
}