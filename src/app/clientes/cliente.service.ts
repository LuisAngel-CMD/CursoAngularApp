import { Injectable } from '@angular/core';
//import { formatDate, DatePipe } from '@angular/common';

import { Cliente } from './cliente';
import { Observable, throwError } from 'rxjs';
import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';

import { map, catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';

@Injectable()
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) {}

  getClientes(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/api/clientes/page/' + page).pipe(
      catchError((error: any) => {
        console.error('Error al obtener los clientes:', error);
        return throwError(
          'Error al obtener los clientes. Por favor, inténtalo de nuevo más tarde.'
        );
      }),
      tap((response: any) => {
        console.log('ClientesService: tap 1');
        if (response && response.Content) {
          // Verificar si response.Content no es undefined
          (response.Content as Cliente[]).forEach((cliente: Cliente) => {
            console.log(cliente.nombre);
          });
        }
      }),
      map((response: any) => {
        if (response && response.Content) {
          return {
            response,
            Content: (response.Content as Cliente[]).map((cliente: Cliente) => {
              cliente.nombre = cliente.nombre.toUpperCase();
              // También puedes realizar otras transformaciones aquí si es necesario
              return cliente;
            }),
          };
        }
        return response;
      }),
      tap((response) => {
        console.log('ClientesService: tap 2');
        if (response && response.Content) {
          // Verificar si response.Content no es undefined
          (response.Content as Cliente[]).forEach((cliente: Cliente) => {
            console.log(cliente.nombre);
          });
        }
      })
    );
  }

  create(cliente: any): Observable<Cliente> {
    return this.http
      .post<Cliente>(this.urlEndPoint, cliente, { headers: this.httpHeaders })
      .pipe(
        catchError((e) => {
          if (e.status == 400) {
            return throwError(e);
          }
          console.error(e.error.mensaje);
          Swal.fire('Error al crear al cliente', e.error.mensaje, 'error');
          return throwError(e);
        })
      );
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http
      .get<Cliente>(`${this.urlEndPoint}/api/clientes/${id}`)
      .pipe(
        catchError((e) => {
          this.router.navigate(['/clientes']);
          console.error(e.error.mensaje);
          Swal.fire('Error al editar', e.error.mensaje, 'error');
          return throwError(e);
        })
      );
  }
  update(cliente: any, id: number): Observable<Cliente> {
    return this.http
      .put<any>(`${this.urlEndPoint}/api/clientes/${id}`, cliente, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((e) => {
          if (e.status == 400) {
            return throwError(e);
          }
          console.error(e.error.mensaje);
          Swal.fire('Error al actualizar al cliente', e.error.mensaje, 'error');
          return throwError(e);
        })
      );
  }

  delete(id: number): Observable<Cliente> {
    return this.http
      .delete<Cliente>(`${this.urlEndPoint}/api/clientes/${id}`, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((e) => {
          console.error(e.error.mensaje);
          Swal.fire('Error al eliminar al cliente', e.error.mensaje, 'error');
          return throwError(e);
        })
      );
  }

  subirFoto(archivo: File, id: any): Observable<HttpEvent<any>> {
    let formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);

    const req = new HttpRequest(
      'POST',
      `${this.urlEndPoint}/api/clientes/upload`,
      formData,
      {}
    );

    return this.http.request(req);
  }
}
