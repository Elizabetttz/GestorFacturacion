import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { authGuard } from './guards/auth.guard';
import { SettingsComponent } from './components/home/settings/settings.component';
import { PerfilSettingComponent } from './components/home/settings/settings-components/perfil-component/perfil-settings.component';
import { CreateUserComponent } from './components/home/settings/settings-components/create-userComponent/create-user.component';
import { InicioComponent } from './components/home/inicio/inicio.component';
import { RoleGuard } from './guards/authlinks.guard-guard';
import { ReportesHomeComponent } from './components/home/reportes/reportes-home/reportes_home.component';
import { UsuariosListComponent } from './components/home/settings/settings-components/usuariosList-component/usuariosList.component';
import { FacturacionComponent } from './components/home/facturacion/facturacion.component';
import { OrdenesComponent } from './components/home/reportes/ordenes/ordenes.component';
import  { AccesibilidadComponent } from './components/home/settings/settings-components/perfil-component/perfil-component/accesibilidad.component'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then(m => m.Login)
  }  ,
  {
    path: 'home', 
    component: Home,
    canActivate: [authGuard],
     children: [

      {path: '', redirectTo: 'inicio', pathMatch:'full'},

      { path: 'inicio', component: InicioComponent }, // por defecto en /home
      
      { path: 'settings', component: SettingsComponent,
        children: [      
            { path: 'perfil', component: PerfilSettingComponent},
            { path: 'createUser', component: CreateUserComponent, canActivate: [RoleGuard], data: { role: 'admin'}},
            { path: 'listUser', component: UsuariosListComponent, canActivate: [RoleGuard], data: { role: 'admin'}},
            { path: '', redirectTo: 'perfil',pathMatch: 'full' },
            {path: 'accesibilidad', component: AccesibilidadComponent },

          ]
       },
       { path: 'reports', component: ReportesHomeComponent
       },
       { path: 'ordenes', component: OrdenesComponent
       }, 
      { path: 'facturacion', component: FacturacionComponent },

    ]
  },
];
