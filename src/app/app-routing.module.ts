import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: '/welcome'},
  {path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule)},
  {path: 'news', loadChildren: () => import('./pages/news/news.module').then(m => m.NewsModule)},
  {path: 'facilities', loadChildren: () => import('./pages/sports-facilities/facilities.module').then(m => m.FacilitiesModule)},
  {path: 'booking', loadChildren: () => import('./pages/booking/booking.module').then(m => m.BookingModule)},
  {path: 'sign-up', loadChildren: () => import('./pages/sign-up/sign-up.module').then(m => m.SignUpModule)},
  {path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)},
  {path: '**', redirectTo: '/welcome'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
