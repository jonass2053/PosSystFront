import { Injectable } from '@angular/core';
import { ServiceResponse } from '../interfaces/service-response-login';
import { baseUrl } from '../../enviroment/enviroment.';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AlertServiceService } from '../components/utilities/alert-service.service';
import { catchError, Observable, throwError } from 'rxjs';
import { iFactura, iPago } from '../interfaces/iTermino';
import { UsuarioService } from './usuario.service';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class PagosService {

  url: string = `${baseUrl}/Pago`;
  private headers: HttpHeaders;
  private header: { headers: HttpHeaders }
  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService,
    private alertasService: AlertServiceService
  ) {
    this.headers = new HttpHeaders({ 'Authorization': `Bearer ${usuarioService.usuarioLogueado.token}` });
    this.header = { headers: this.headers };

  }

  facturaPagar!: iFactura;
  pagoForEdit! : iPago;
  insert(formulario: any): Observable<ServiceResponse> {
    return this.http.post<ServiceResponse>(`${this.url}`, formulario, this.header).pipe(
      catchError(this.handleError)
    );
  }

  insertMultyPayments(formulario: any): Observable<ServiceResponse> {
    return this.http.post<ServiceResponse>(`${this.url}/CreateMultiPayments`, formulario, this.header).pipe(
      catchError(this.handleError)
    );
  }

  update(formualrio: any): Observable<ServiceResponse> {
    return this.http.put<ServiceResponse>(`${this.url}`, formualrio, this.header)
  }

  delete(id: number): Observable<ServiceResponse> {
    return this.http.delete<ServiceResponse>(`${this.url}/${id}`, this.header)
  }

  getAll(idSucursal: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/GetByIdSucursal/${idSucursal}`, this.header).pipe(
      catchError(this.handleError)
    );
  }

  getByIdFactura(idFactura: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.url}/get_by_idfactura/${idFactura}`, this.header)
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error desconocido.';
    console.log(error.status)

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
      this.alertasService.errorAlert(error.message)
      console.log(errorMessage)
    }
    console.error(errorMessage); // Registro del error
    return throwError(() => new Error(errorMessage)); // Devuelve un Observable con el error
  }
}
