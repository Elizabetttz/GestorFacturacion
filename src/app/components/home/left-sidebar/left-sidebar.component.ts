import { Component, input, output, Output, signal} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, getLocaleNumberSymbol, NgClass } from'@angular/common';
import { FeatherModule } from 'angular-feather';
import { SubscriptionLoggable } from 'rxjs/internal/testing/SubscriptionLoggable';
@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss'],
  imports: [RouterModule, NgClass, CommonModule,FeatherModule]
})
export class LeftSidebarComponent {
  isLeftSidebarCollapsed = input.required<boolean>(); //se declara un input signal, el componente padre le debe pasar 
                                                      //un valor booleno indicando si la sidebar esta coolapsada o no.

  changeIsLeftSidebarCollapsed = output<boolean>(); //Emite eventos hacia el componente padre cuando este colapsada la sidebar
  
  items = [ //El array que contiene los objetos de la sidebar
    { 
      routeLink: 'inicio',
      icon: 'home',
      label: 'Inicio'
    },
    {
      routeLink: 'settings',
      icon: 'settings',
      label: 'Configuración' 
    },
    {
      icon: 'database',
      label: 'Facturación',
      children: [
        { icon: 'plus', label: 'Nueva Factura', routeLink: 'home-factur'},
        { icon: 'plus', label: 'Nueva Factura', routeLink: 'home-factur'},
        { icon: 'plus', label: 'Nueva Factura', routeLink: 'home-factur'},
      ]
    },
    {
      routeLink: 'reports',
      icon: 'clipboard',
      label: 'Informes'
    }
  ];

  //signal para el submeno facturacion
    openMenus = signal<Set<string>>(new Set());

  toggleSubmenu(label: string){
    const menus = new Set(this.openMenus());
    if (menus.has(label)){
      menus.delete(label);
    } else {
      menus.add(label);
    }
    this.openMenus.set(menus);
  }
  
  isSubmenuOpen(label: string): boolean{
    return this.openMenus().has(label);
  }


  toggleCollapse(): void{ //Es el metodo que cambia el estado de la sidebar. 
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed()) //Toma el valor de "isleftsidebarCo.." (true/fal) y lo invierte
  }

  closeSidenav():void{
    this.changeIsLeftSidebarCollapsed.emit(true);
  }
}