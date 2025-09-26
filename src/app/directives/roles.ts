import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { OnInit, Input } from '@angular/core';
import { AuthService } from '../services/auth';
@Directive({
  selector: '[appRoles]'
})
export class Roles implements OnInit{
  
  private tipoUsuario : string | null = null;
  @Input('appRoles') role!: string;  
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService : AuthService,
  ) 
  {

  }

  ngOnInit(): void{
    this.tipoUsuario = this.authService.obtenerTipoUsuario();
    console.log('Tipo usuario: ', this.tipoUsuario);
  
    if(this.tipoUsuario === this.role){
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else 
    {
      this.viewContainer.clear();
    }
  }

  
}
