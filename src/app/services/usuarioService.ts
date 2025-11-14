import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
@Injectable({
  providedIn: 'root'
})
export class usuarioService {
  private apiUrl = 'http://localhost:3000/usuarios';

  constructor(private http:HttpClient){}

  crearUsuario(usuario: any){
    return this.http.post(this.apiUrl, usuario)
  }

  deleteUsuario(id:number): Observable<any>{
    console.log('Eliminando factura con id:', id);
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  public getAllUsers(): Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.apiUrl);
  }

}

  
