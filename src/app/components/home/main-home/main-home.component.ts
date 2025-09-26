import { CommonModule } from "@angular/common";
import { Component, computed, input, Signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AuthService } from '../../../services/auth';


@Component({
  selector: "app-main-home",
  templateUrl: "./main-home.component.html",
  styleUrls: ["./main-home.component.scss"],
  imports: [RouterOutlet, CommonModule]
})
export class MainHomeComponent {

  nombreUsuario : string | null = null;

  constructor(private authService:AuthService){}

  ngOnInit(): void {
    this.nombreUsuario = this.authService.obtenerNombreUsuario();
    console.log('Nombre usuario:', this.nombreUsuario)
  } 

  isLeftSidebarCollapsed = input<Signal<boolean>>()
  screenWidth = input<Signal<number>>();
  sizeClass = computed(() => {
    const isCollapsedSignal = this.isLeftSidebarCollapsed();
    const widthSignal = this.screenWidth();
    if(!isCollapsedSignal || !widthSignal ){
      return '';
    }

    const isCollapsed = isCollapsedSignal();
    const width = widthSignal();

    if (isCollapsed){
      return '';
    }
    if (!isCollapsed && width < 768){
      return 'body-trimmed'
    }
    console.log('si estoy ')
    return width > 768 ? 'body-trimmed' : 'body-md-screen';
  });
}

