import { Routes } from '@angular/router';
import {AuthPageComponent} from './features/auth/pages/auth-page/auth-page.component';
import {CatalogPageComponent} from './features/rent-offer/pages/catalog-page/catalog-page.component';
import {UserLayoutComponent} from './layouts/user-layout/user-layout.component';
import {ProfilePageComponent} from './features/user/pages/profile-page/profile-page.component';
import {authGuard} from './core/guards/auth.guard';
import {UserRentOffersComponent} from './features/user/components/user-rent-offers/user-rent-offers.component';
import {DetailsPageComponent} from './features/rent-offer/pages/details-page/details-page.component';
import {
  UserRentOfferDetailsPageComponent
} from './features/user/pages/user-rent-offer-details-page/user-rent-offer-details-page.component';
import {CreateRentOfferComponent} from './features/user/components/create-rent-offer/create-rent-offer.component';

export const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: '',
        component: CatalogPageComponent
      },
      {
        path: 'rent-offer/:id',
        component: DetailsPageComponent
      },
      {
        path: 'profile',
        component: ProfilePageComponent,
        canActivate: [authGuard],
        children: [
          {
            path: 'my-rent-offers',
            component: UserRentOffersComponent
          },
          {
            path: 'my-rent-offers/create',
            component: CreateRentOfferComponent
          },
          {
            path: 'my-rent-offers/:id',
            component: UserRentOfferDetailsPageComponent
          }
        ]
      }
    ]
  },
  {
    path: 'auth',
    component: AuthPageComponent
  }
];
