import { Routes } from '@angular/router';
import {AuthPageComponent} from './features/auth/pages/auth-page/auth-page.component';
import {CatalogPageComponent} from './features/rent-offer/pages/catalog-page/catalog-page.component';
import {UserLayoutComponent} from './layouts/user-layout/user-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: '',
        component: CatalogPageComponent
      }
    ]
  },
  {
    path: 'auth',
    component: AuthPageComponent
  }
];
