import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from "../../../../../services/auth";

import { Usuario } from '../../../../../models/usuario.model';

interface UserProfile {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  empresa: string;
  direccion: string;
  avatar: string;
  rfc: string;
}

interface UserStats {
  totalFacturas: number;
  totalClientes: number;
  ingresosTotales: number;
}

@Component({
    selector: 'app-perfil-setting',
    templateUrl: './perfil-settings.component.html',
    styleUrls: ['./perfil-settings.component.scss']
})
export class PerfilSettingComponent implements OnInit {
    
  nombreUsario: string | null = null;
  tipo_usuario : string | null = null;



  profileForm: FormGroup;
  isEditing = false;
  originalData: UserProfile;

  stats: UserStats = {
    totalFacturas: 45,
    totalClientes: 23,
    ingresosTotales: 125000
  };

  constructor(
    private authService:AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.profileForm = this.createForm();
    this.originalData = this.getUserData();
  }

  ngOnInit(): void {
    this.loadUserData();
    this.tipo_usuario = this.authService.obtenerTipoUsuario();
    this.nombreUsario = this.authService.obtenerNombreUsuario();
  }

  createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern('^[0-9+\\-\\s()]*$')]],
      empresa: [''],
      direccion: [''],
      avatar: [''],
      rfc: ['']
    });
  }

  getUserData(): UserProfile {
    // En una app real, esto vendría de un servicio
    return {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@empresa.com',
      telefono: '+52 55 1234 5678',
      empresa: 'Mi Empresa SA de CV',
      direccion: 'Av. Reforma 123, Ciudad de México',
      avatar: 'assets/avatar.jpg',
      rfc: 'PEEJ800101ABC'
    };
  }

  loadUserData(): void {
    this.profileForm.patchValue(this.originalData);
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    
    if (!this.isEditing) {
      // Cancelar edición - restaurar valores originales
      this.profileForm.patchValue(this.originalData);
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      // En una app real, aquí llamarías a un servicio
      console.log('Datos guardados:', this.profileForm.value);
      this.originalData = { ...this.profileForm.value };
      this.isEditing = false;
      
      // Mostrar mensaje de éxito
      alert('Perfil actualizado correctamente');
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileForm.patchValue({ avatar: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  logout(): void {
    // Lógica de cierre de sesión
    this.router.navigate(['/login']);
  }
}