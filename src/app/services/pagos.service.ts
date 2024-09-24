import { Injectable } from '@angular/core';
import { ServiceResponse } from '../interfaces/service-response-login';
import { baseUrl } from '../../enviroment/enviroment.';
import { HttpClient } from '@angular/common/http';
import { AlertServiceService } from '../components/utilities/alert-service.service';
import { Observable } from 'rxjs';
import { iFactura } from '../interfaces/iTermino';

@Injectable({
  providedIn: 'root'
})
export class PagosService {

  url : string = `${baseUrl}/Pago`;
  constructor(
      private http : HttpClient,
      private alertas : AlertServiceService
     ) { }
   
  facturaPagar! : iFactura;
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
 getByIdFactura(idFactura : number) : Observable<ServiceResponse>
 {
  return this.http.get<ServiceResponse>(`${this.url}/get_by_idfactura/${idFactura}`)
 }
}
