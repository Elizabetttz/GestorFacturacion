import { Component, importProvidersFrom } from '@angular/core';
import { usuarioService } from '../../../../../services/usuarioService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
    selector: 'app-create-user',
    templateUrl: './create-user.component.html',
    styleUrls: ['./create-user.component.scss'],
    imports: [FormsModule, ReactiveFormsModule]
})
export class CreateUserComponent {
    userForm: FormGroup;

    constructor(private fb: FormBuilder, private usuarioService: usuarioService){
        this.userForm = this.fb.group({
            tipo_usuario: ['', Validators.required],
            documento: ['', Validators.required],
            nombre: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

 
    crearUsuario(){
        if(this.userForm.valid){
            const nuevoUsuario = this.userForm.value;

            this.usuarioService.crearUsuario(nuevoUsuario).subscribe({
                next: (res) => {
                    console.log('usuario creado:', res);
                    this.userForm.reset();
                },
                error:(err) => {
                    console.log('Error al crear el usuario', err);
                }
            });
        } else {
            console.log('Formulario invalido');
        }
    }
}