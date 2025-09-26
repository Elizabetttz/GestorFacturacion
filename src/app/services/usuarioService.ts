import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class usuarioService {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http:HttpClient){}

  crearUsuario(usuario: any){
    return this.http.post(this.apiUrl, usuario)
  }
}
