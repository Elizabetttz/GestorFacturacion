import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Facturas_recibidas } from '../models/facturas_recibidas.model';

@Injectable({
  providedIn: 'root'
})
export class FacturacionRecibidasService {  // ✅ Agregué "Service" al nombre
  private apiUrl = 'http://localhost:3000/facturas_recibidas';

  constructor(private http: HttpClient) {}

  public atualizarFacturas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/actualizar`, {responseType: 'text'});
  }

  // Obtener todas las facturas
  public getAllFacturas(): Observable<Facturas_recibidas[]> {
    return this.http.get<Facturas_recibidas[]>(this.apiUrl);
  }

  // Obtener una factura por ID
  public getFacturaById(id: number): Observable<Facturas_recibidas> {
    return this.http.get<Facturas_recibidas>(`${this.apiUrl}/${id}`);
  }

  // Eliminar factura
  deleteFactura(id: number): Observable<any> {
    console.log('Eliminando factura con id:', id);
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  // Buscar facturas
  searchFacturas(term: string): Observable<Facturas_recibidas[]> {
    return this.http.get<Facturas_recibidas[]>(`${this.apiUrl}/search/${term}`);
  }

  // Descargar PDF (si lo necesitas desde el backend como blob)
  downloadPDF(ruta: string): Observable<Blob> {
    const filename = ruta.split('\\').pop();
    return this.http.get(`http://localhost:3000/facturas/${filename}`, {
      responseType: 'blob'
    });
  }

  // Subir nueva factura (opcional)
  uploadFactura(facturaData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload`, facturaData);
  }

  // Actualizar factura (opcional)
  updateFactura(id: number, facturaData: Partial<Facturas_recibidas>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, facturaData);
  }
}
