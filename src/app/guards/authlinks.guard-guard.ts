import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth';

@Injectable ({
  providedIn: 'root'
})

export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router){}

  canActivate(): boolean {
    const userType = this.authService.obtenerTipoUsuario();
    if(userType === 'admin') {
      return true;
    }
    this.router.navigate(['./components/home/settings/settings-components/perfil-component/perfil-settings.component']);
    return false;
  }
}

