import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AdminGuard } from './auth/admin.guard';

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
    canLoad: [AuthGuard]
  },
  { 
    path: 'signup', 
    loadChildren: './auth/signup/signup.module#SignupPageModule' 
  },
  { 
    path: 'admin', 
    loadChildren: './admin/admin.module#AdminPageModule',
    canLoad: [AuthGuard, AdminGuard] 
  },
  { 
    path: 'item-detail/:itemId', 
    loadChildren: './item-detail/item-detail.module#ItemDetailPageModule', 
    canLoad: [AuthGuard]
  },
  { 
    path: 'payment', 
    loadChildren: './payment/payment.module#PaymentPageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'edit-profile/:profileId', 
    loadChildren: './auth/profile/edit-profile/edit-profile.module#EditProfilePageModule',
    canLoad: [AuthGuard] 
  },
  {
    path: 'edit-profile',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
