import { Injectable } from '@angular/core';
import { ServiceResponse } from '../interfaces/service-response-login';
import { Observable, catchError } from 'rxjs';
import { AlertServiceService } from '../components/utilities/alert-service.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { baseUrl } from '../../enviroment/enviroment.';
import { iEstado } from '../interfaces/iTermino';

@Injectable({
  providedIn: 'root'
})
export class NumeracionService {

  url : string = `${baseUrl}/Numeracion`;
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
     updateStatus(id : number, estado : boolean) : Observable<ServiceResponse>
     { 
      return this.http.put<ServiceResponse>(`${this.url}/updateestado`, {'id': id, 'estado' : estado})
     }
     delete(id : number) : Observable<ServiceResponse>
     {
      return this.http.delete<ServiceResponse>(`${this.url}/${id}`)
     }
     getAll() : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${this.url}`)
     }
     getAllTipoDocumentos() : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${this.url}/get-tipo-documentos`)
     }
       getTipoNumeracion(id : number) : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${this.url}/get-tipo-nuemracion/${id}`)
     }
    
     setDefautlNumeration(idNumeracion : number) : Observable<ServiceResponse>
     {
      return this.http.post<ServiceResponse>(`${this.url}/setdefault`, idNumeracion)
     }
}
 