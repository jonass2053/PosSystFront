import { Injectable } from '@angular/core';
import { ServiceResponse } from '../interfaces/service-response-login';
import { baseUrl } from '../../enviroment/enviroment.';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertServiceService } from '../components/utilities/alert-service.service';
import { Observable } from 'rxjs';
import { iFactura } from '../interfaces/iTermino';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class PagosService {

  url : string = `${baseUrl}/Pago`;
  private headers: HttpHeaders;
  private header: { headers: HttpHeaders }
  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService,
    private alertasService : AlertServiceService
  ) {
    this.headers = new HttpHeaders({ 'Authorization': `Bearer ${usuarioService.usuarioLogueado.token}`});
    this.header = { headers: this.headers };

  }
   
  facturaPagar! : iFactura;
  insert(formualrio : any) : Observable<ServiceResponse> {
    return this.http.post<ServiceResponse>(`${this.url}`, formualrio, this.header)
 }
 update(formualrio : any) : Observable<ServiceResponse>
 {
  return this.http.put<ServiceResponse>(`${this.url}`, formualrio, this.header)
 }
 delete(id : number) : Observable<ServiceResponse>
 {
  return this.http.delete<ServiceResponse>(`${this.url}/${id}`, this.header)
 }
 getAll(idSucursal : number) : Observable<ServiceResponse>
 {
  return this.http.get<ServiceResponse>(`${this.url}/${idSucursal}`, this.header)
 }
 getByIdFactura(idFactura : number) : Observable<ServiceResponse>
 {
  return this.http.get<ServiceResponse>(`${this.url}/get_by_idfactura/${idFactura}`, this.header)
 }
}
