import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {allIcons} from 'angular-feather/icons'
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { FeatherModule } from 'angular-feather';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(FeatherModule.pick(allIcons))
  ]
};
