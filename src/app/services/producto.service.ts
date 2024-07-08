import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../enviroment/enviroment.';
import { AlertServiceService } from '../components/utilities/alert-service.service';
import { ServiceResponse } from '../interfaces/service-response-login';
import { Observable, catchError } from 'rxjs';
import { iImpuestoProductoCodigo } from '../interfaces/iTermino';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  url : string = `${baseUrl}/Producto`;
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
     getAll() : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${this.url}`)
     }
     getAllUnidades() : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${this.url}/getunidades`)
     }
     getAllUnidadesFilter(filter : string) : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${this.url}/getunidades/${filter}`)
     }
     getAllCuentas() : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${this.url}/getcuentas`)
     }
     getAllCategorias() : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${baseUrl}/Categoria`)
     }
     getAllMarcas(idCategoria : number) : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${baseUrl}/Categoria`)
     }

     getAllModelos(idMarca : number) : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${baseUrl}/Categoria`)
     }
     
     insertImpuestos(impuestos : iImpuestoProductoCodigo[]) : Observable<ServiceResponse>
     {
      return this.http.post<ServiceResponse>(`${this.url}/addimpuestos`, impuestos)
     }
     getAllFilter(valor : string) : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${this.url}/filter/${valor}`)
     }
     getAllFilterForDocument(valor : string) : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${this.url}/filter-for-document/${valor}`)
     }
   
}
