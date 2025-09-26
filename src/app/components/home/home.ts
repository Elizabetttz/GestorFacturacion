import { Component, signal, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth';
import { LeftSidebarComponent } from "./left-sidebar/left-sidebar.component";
import { MainHomeComponent } from './main-home/main-home.component';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-home',
  imports: [LeftSidebarComponent, MainHomeComponent, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  tipoUsuario: string | null = null;

  constructor(private authService: AuthService){}

  ngOnInit() : void {
    this.tipoUsuario = this.authService.obtenerTipoUsuario();
    console.log('Tipo de usuario:', this.tipoUsuario);
  }

  //SIDEBAR COLLAPSE//////
  isLeftSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(window.innerWidth);


  @HostListener('window:resize') //Cada vez que el usuario cambbie el tamaña de la ventana se ejecutara el metodo onResize()
  onResize(){
    this.screenWidth.set(window.innerWidth); //Guarda el ancho actual de la pantalla en screenwidth
    if(this.screenWidth() < 768){
      this.isLeftSidebarCollapsed.set(true);
    }
  }

  changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void{
    this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed);
  }
}
