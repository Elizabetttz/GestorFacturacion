import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeatherModule } from "angular-feather";
import { AuthService } from '../../../../../services/auth';
import { Usuario } from '../../../../../models/usuario.model';
import { Observable, Subscription } from 'rxjs';
import { usuarioService } from '../../../../../services/usuarioService';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-usuarios-list',
    templateUrl: './usuariosList.component.html',
    styleUrls: ['./usuariosList.component.scss'],
    imports: [FeatherModule, FormsModule, CommonModule]
})
export class UsuariosListComponent implements OnInit, OnDestroy {

    searchTerm = signal('');
    selectedUsers = signal<Set<number>>(new Set());

    //traer los usuarios desde el backend
    users = signal<Usuario[]>([]);

    private usersSubscription: Subscription | undefined = undefined;

    constructor(private userService: usuarioService){}
    
    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers() {
        this.usersSubscription = this.userService.getAllUsers().subscribe({
            next: (data) => {
                //avatar con las iniiciales
                console.log('Datos del backend:', data);
                const usersWithAvatar = data.map(user => ({
                    ...user,
                    avatar: this.getInitials(user.nombre)
                }));

                this.users.set(usersWithAvatar);
                console.log('Usuarios cargados:', usersWithAvatar);
            },
            error: (err) =>{
                console.error('Error al cargar usuarios:', err);
            }        
        });
    }



    getInitials(name: string): string{
        const words = name.split(' ');
        if(words.length >= 2){
            return (words[0][0] + words [1][0]).toUpperCase();
        } 
        return name.substring(0,2).toUpperCase();
    }

    ngOnDestroy(): void {
        this.usersSubscription?.unsubscribe();
    }

    /// 
    toggleUserSelection(id: number){
        const current = new Set(this.selectedUsers());
        if(current.has(id)){
            current.delete(id);
        } else {
            current.add(id);
        }
        this.selectedUsers.set(current);
    }

    toggleSelectedAll(){
        if(this.selectedUsers().size === this.users.length){
            this.selectedUsers.set(new Set());
        } else {
            this.selectedUsers.set(new Set(this.users().map(u => u.id)));
        }
    }

    isSelected(id: number): boolean{
        return this.selectedUsers().has(id);
    }

    allSelected(): boolean {
        return this.selectedUsers().size === this.users.length;
    }

    getRoleColor(role: string): string {
        const colors: Record<string, string> = {
            'admin' : 'tipo_usuario-admin',
            'aux' : 'tipo_usuario-aux'
        };
        return colors[role] || 'tipo_usuario-user';
    }

    editUser(user: Usuario){
        console.log('Ediatr:', user);
    }

    deleteUser(user: Usuario): void {
        const confirmacion = confirm(
            `¿Estas segurp de eliminar el usuario ${user.id}?\n\nEsta accion no se puede deshacer.`
        );

        if(confirmacion){
            this.userService.deleteUsuario(user.id).subscribe({
                next: (res) => {
                    console.log('Factura eliminada');
                    alert('Usuario eliminado correctamente')
                    this.loadUsers();
                },
                error: (err) => {
                    console.error('Error al eliminar factura:', err);
                }
            });
        }
    }

}