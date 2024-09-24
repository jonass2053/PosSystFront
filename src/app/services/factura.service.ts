import { Injectable } from '@angular/core';
import { baseUrl } from '../../enviroment/enviroment.';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { AlertServiceService } from '../components/utilities/alert-service.service';
import { catchError, Observable } from 'rxjs';
import { ServiceResponse } from '../interfaces/service-response-login';
import { iFactura } from '../interfaces/iTermino';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
 facturaEdit!:iFactura;
  url : string = `${baseUrl}/Factura`;
  constructor(
      private http : HttpClient,
     ) { }
   
     
     insert(formualrio : any) : Observable<ServiceResponse> {
        return this.http.post<ServiceResponse>(`${this.url}`, formualrio)
     }
     update(formualrio : any) : Observable<ServiceResponse>
     {
      return this.http.put<ServiceResponse>(`${this.url}`, formualrio)
     }
     delete(id : number) : Observable<ServiceResponse>
     {
      return this.http.delete<ServiceResponse>(`${this.url}/${id}`)
     }
     getAll(idSucursal : number) : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${this.url}/${idSucursal}`)
     }
     getById(idFactura : number) : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${this.url}/getbyid/${idFactura}`)
     }
     getAllMetodoPago() : Observable<ServiceResponse>
     {
      return this.http.get<ServiceResponse>(`${this.url}/get_all_metodopago`)
     }
}
