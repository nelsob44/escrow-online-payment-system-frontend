import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AdminGuard } from './auth/admin.guard';
import {VerifiedGuard} from './auth/verified.guard';
import { PaymentModalComponent } from './shared/payment-modal/payment-modal.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { 
    path: 'login',
    loadChildren: './auth/login/login.module#LoginPageModule'
  },
  { 
    path: 'request-reset', 
    loadChildren: './auth/password/request-reset/request-reset.module#RequestResetPageModule' 
  },
  { 
    path: 'response-reset', 
    loadChildren: './auth/password/response-reset/response-reset.module#ResponseResetPageModule' 
  },
  { 
    path: 'profile', 
    loadChildren: './auth/profile/profile.module#ProfilePageModule', 
    canActivate: [AuthGuard, VerifiedGuard]
  },
  { 
    path: 'signup', 
    loadChildren: './auth/signup/signup.module#SignupPageModule' 
  },
  { 
    path: 'admin', 
    loadChildren: './admin/admin.module#AdminPageModule',
    canActivate: [AuthGuard, VerifiedGuard, AdminGuard] 
  },
  { 
    path: 'item-detail/:itemId', 
    loadChildren: './item-detail/item-detail.module#ItemDetailPageModule', 
    canActivate: [AuthGuard, VerifiedGuard]
  },
  { 
    path: 'payment', 
    loadChildren: './payment/payment.module#PaymentPageModule',
    canActivate: [AuthGuard, VerifiedGuard]
  },
  { 
    path: 'edit-profile/:profileId', 
    loadChildren: './auth/profile/edit-profile/edit-profile.module#EditProfilePageModule',
    canActivate: [AuthGuard, VerifiedGuard] 
  },
  {
    path: 'edit-profile',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
    canActivate: [AuthGuard, VerifiedGuard]
  },
  { 
    path: 'verify', 
    loadChildren: './auth/verify/verify.module#VerifyPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
