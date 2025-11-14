import { Component } from '@angular/core';
import { Theme } from '../../../../../../services/theme';

@Component({
    selector: 'app-accesibilidad',
    templateUrl: './accesibilidad.component.html',
    styleUrls: ['./accesibilidad.component.scss']
})
export class AccesibilidadComponent { 

    constructor(public theme: Theme){}
}