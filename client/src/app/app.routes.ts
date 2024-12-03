import { Routes } from '@angular/router';
import {AuthPageComponent} from './features/auth/pages/auth-page/auth-page.component';
import {CatalogPageComponent} from './features/catalog/pages/catalog-page/catalog-page.component';
import {UserLayoutComponent} from './layouts/user-layout/user-layout.component';
import {ProfilePageComponent} from './features/profile/pages/profile-page/profile-page.component';
import {authGuard} from './core/guards/auth.guard';
import {UserRentOffersComponent} from './features/profile/components/user-rent-offers/user-rent-offers.component';
import {DetailsPageComponent} from './features/catalog/pages/details-page/details-page.component';
import {
  UpdateRentOfferComponent
} from './features/profile/components/update-rent-offer/update-rent-offer.component';
import {CreateRentOfferComponent} from './features/profile/components/create-rent-offer/create-rent-offer.component';
import {UserBookingsComponent} from './features/profile/components/user-bookings/user-bookings.component';

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
            component: UpdateRentOfferComponent
          },
          {
            path: 'my-bookings',
            component: UserBookingsComponent
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
