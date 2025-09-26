import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Theme {
  private currentTheme = 'light-theme';

  toggleTheme(){
    this.currentTheme = this.currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
    document.body.className = this.currentTheme;
  }

  getCurrentTheme(){
    return this.currentTheme;
  }
}
