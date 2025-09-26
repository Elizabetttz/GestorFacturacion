import { Injectable } from '@angular/core'; //Permite que el servicio se pueda injectar en otros componentes.
import { HttpClient } from '@angular/common/http'; //Para hacer peticiones HTTP, conectarse al backend
import {Router} from '@angular/router'; //El enrutamiento.
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: number;
  name: string;
  tipo: string;
  exp: number;
  }

@Injectable({
  providedIn: 'root'  //Estara disponible en toda la aplicacion sin tener qu estar declarado en providers
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; //Direccion de la api del backend

  constructor(private http: HttpClient, private router: Router){} //Se inyecta en el constructor HTTPcliente y router 

  login(documento: string, psw: string){  //El metodo login que hace un Post al endpoint del backend,
    return this.http.post<any>(`${this.apiUrl}/login`, {documento, psw}) //envia documento y contraseña y devuelve un token 
    }

  guardarToken(token: string){
    localStorage.setItem('token', token); //Guarda el token en el lcal storage del navegador
  }

  obtenerToken() {
    return localStorage.getItem('token'); //permmite recuperar el token 
  }

  obtenerTipoUsuario(): string | null{
    const token = this.obtenerToken();  
    if(!token) return null;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.tipo; //decodifica el token para obtener el tipo de usuario
    } catch (error){
      console.error('Error al decodificar el token', error);
      return null;
    }
  }

  obtenerNombreUsuario(): string | null{
    const token = this.obtenerToken();
    if(!token) return null;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.name;
    } catch (error){
      console.log('Error al decodificar el token.', error)
      return null;
    }
  }

  cerrarSesion(){
    localStorage.removeItem('token'); //borra el token y redirige
    this.router.navigate(['/login']);
  }

  estaLogueado(): boolean {
    return !! localStorage.getItem('token'); // verifica si esta logueado el !! convierte el valor en un booleano.
  }
}
