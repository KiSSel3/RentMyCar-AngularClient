import { Routes } from '@angular/router';
import {AuthPageComponent} from './features/auth/pages/auth-page/auth-page.component';
import {CatalogPageComponent} from './features/rent-offer/pages/catalog-page/catalog-page.component';

export const routes: Routes = [
  {
    path: '',
    component: CatalogPageComponent
  },
  {
    path: 'auth',
    component: AuthPageComponent
  }
];
