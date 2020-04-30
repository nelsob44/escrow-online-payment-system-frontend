import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate, CanActivateChild } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, switchMap, tap } from 'rxjs/operators';
import { BridgeService } from '../bridge.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VerifiedGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private bridgeService: BridgeService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.bridgeService.isVerified.pipe(
     take(1),
     switchMap(isAuthenticated => {
        if(!isAuthenticated) {
          //return this.router.navigateByUrl('/login');
          return this.authService.autoLogin();
        } else {
          return of(isAuthenticated);
        }
      }),
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          return this.router.navigateByUrl('/tabs/home');
        } else {
          return of(isAuthenticated);
        }
      })
    );
  }
  
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
}
