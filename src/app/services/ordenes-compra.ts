import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ordenes_Compra } from '../models/ordenes_compra';

@Injectable({
  providedIn: 'root'
})
export class OrdenesCompraService {  // ✅ Cambié el nombre de la clase
  private apiUrl = 'http://localhost:3000/ordenes_compra';

  constructor(private http: HttpClient) {}

  public actualizarOrdenes(): Observable<any>{
    return this.http.get(`${this.apiUrl}/actualizar`, {responseType: 'text'});
  }

  public getAllFacturas(): Observable<Ordenes_Compra[]> {
    return this.http.get<Ordenes_Compra[]>(this.apiUrl);
  }

  deleteFactura(id: number): Observable<any> {
    console.log('Eliminando orden de compra con id:', id);
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  // Método adicional para descargar PDF si lo necesitas
  downloadPDF(ruta: string): Observable<Blob> {
    return this.http.get(`http://localhost:3000/ordenes/${ruta.split('\\').pop()}`, {
      responseType: 'blob'
    });
  }
}