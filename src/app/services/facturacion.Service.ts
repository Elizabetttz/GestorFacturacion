import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Factura } from '../models/factura.model';

@Injectable({
  providedIn: 'root'
})

export class FacturacionService {
  private apiUrl = 'http://localhost:3000/facturas';
  
  constructor(private http:HttpClient){}
  public getAllFacturas(): Observable<Factura[]>{
    return this.http.get<Factura[]>(this.apiUrl);
  }

  deleteFactura(id: number): Observable<any>{
    console.log('Eliminando factura con id:', id)
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}

