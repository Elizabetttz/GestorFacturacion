import { Component, input, OnInit, Injectable } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Roles } from "../../../directives/roles";
import { RouterLink, RouterOutlet, CanActivate, Router, RouterModule } from "@angular/router";
import { AuthService } from "../../../services/auth";
import { Theme } from "../../../services/theme";
@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet, RouterModule]
})
export class SettingsComponent {

    nombreUsuario : string | null = null;
    tipo_usuario : string | null = null;

    constructor(private authService:AuthService, public theme: Theme){}
  
    ngOnInit(): void {
      this.tipo_usuario = this.authService.obtenerTipoUsuario();
      this.nombreUsuario = this.authService.obtenerNombreUsuario();
      console.log('Nombre usuario:', this.nombreUsuario)
      this.tipo_usuario = this.authService.obtenerTipoUsuario();
    } 

    menuOpen = false;

    toggleMenu(){
      this.menuOpen = !this.menuOpen;
    }
    
}