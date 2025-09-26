import { Component, input, output, Output} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, NgClass } from'@angular/common';
@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss'],
  imports: [RouterModule, NgClass, CommonModule]
})
export class LeftSidebarComponent {
  isLeftSidebarCollapsed = input.required<boolean>(); //se declara un input signal, el componente padre le debe pasar 
                                                      //un valor booleno indicando si la sidebar esta coolapsada o no.

  changeIsLeftSidebarCollapsed = output<boolean>(); //Emite eventos hacia el componente padre cuando este colapsada la sidebar
  
  items = [ //El array que contiene los objetos de la sidebar
    { 
      routeLink: 'inicio',
      icon: 'fa fa-home',
      label: 'Inicio'
    },
    {
      routeLink: 'settings',
      icon: 'fa fa-cog',
      label: 'Configuración' 
    },
    {
      routeLink: 'reports',
      icon: 'fa fa-chart-bar',
      label: 'Informes'
    }
  ];

  toggleCollapse(): void{ //Es el metodo que cambia el estado de la sidebar. 
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed()) //Toma el valor de "isleftsidebarCo.." (true/fal) y lo invierte
  }

  closeSidenav():void{
    this.changeIsLeftSidebarCollapsed.emit(true);
  }
}