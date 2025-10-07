import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat', // Este es el nombre que usarás en el template
  standalone: true // Si estás en Angular moderno
})
export class CurrencyFormatPipe implements PipeTransform {

  transform(value: number, locale: string = 'es-CO', currency: string = 'COP'): string {
    if (typeof value !== 'number' || isNaN(value)) {
        return ''; 
    }

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(value);
  }
}