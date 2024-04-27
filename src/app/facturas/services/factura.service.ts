import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, catchError, map, throwError } from 'rxjs';

import { Factura } from '../models/factura';
import { Producto } from '../models/producto';

@Injectable()
export class FacturaService {



  private urlEndPoint: string = 'http://localhost:8080/api/facturas';
  agregarItem: any;

  constructor( private http: HttpClient) { }

  getFacturas(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.urlEndPoint}/${id}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`);
  }

  filtrarProductos(): Observable<Producto[]> {

    return this.http.get<Producto[]>(`${this.urlEndPoint}/productos`)
    .pipe(
      catchError((error: any) => {

        console.error('Error al filtrar los productos:', error);
        return throwError(
          'Error al filtrar  los productos. Por favor, inténtalo de nuevo más tarde.'
        );
      }),
      map((response: any) => {
        return response as Producto[];
      })
    );
  }


  create(factura: Factura): Observable<Factura> {
    return this.http.post<Factura>(this.urlEndPoint+'/newFactura', factura);
  }

}
