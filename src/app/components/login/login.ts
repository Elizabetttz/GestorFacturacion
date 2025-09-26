import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService }  from '../../services/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  documento: string = '';
  psw: string = '';
  errorMsg: string = '';

  constructor(private authService: AuthService, private router: Router ){}

  login(){
    this.authService.login(this.documento, this.psw).subscribe({
      next: (res) => {
        this.authService.guardarToken(res.token);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMsg = err.error.message;
      }
    });
  }
}

//Angular usa observables (subscribe) un observable es como una fuente de datos que emite valores
// a lo largo del tiempo y uno puedo subscribirse para "escuchar" esos valores: Ej : Netflix = observable , la serie = datos que llegan , subscripcion = ver series