import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { authGuard } from './guards/auth.guard';
import { ReportsComponent} from './components/home/reports/reports.component';
import { SettingsComponent } from './components/home/settings/settings.component';
import { MainHomeComponent } from './components/home/main-home/main-home.component';
import { PerfilSettingComponent } from './components/home/settings/settings-components/perfil-component/perfil-settings.component';
import { CreateUserComponent } from './components/home/settings/settings-components/create-userComponent/create-user.component';
import { InicioComponent } from './components/home/inicio/inicio.component';
import { RoleGuard } from './guards/authlinks.guard-guard';
import { UsuariosListComponent } from './components/home/settings/settings-components/usuariosList-component/usuariosList.component';
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
            { path: 'perfil', component: PerfilSettingComponent },
            { path: 'createUser', component: CreateUserComponent, canActivate: [RoleGuard], data: { role: 'admin'}},
            { path: 'listUser', component: UsuariosListComponent, canActivate: [RoleGuard], data: { role: 'admin'}},
            { path: '', redirectTo: 'perfil',pathMatch: 'full' }
          ]
       },
      { path: 'reports', component: ReportsComponent },
    ]
  },
];
