import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, switchMap, tap } from 'rxjs/operators';
import { BridgeService } from '../bridge.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VerifiedGuard implements CanLoad {
  constructor(private authService: AuthService, private bridgeService: BridgeService, private router: Router) {}
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.bridgeService.isVerified.pipe(
     take(1),
     switchMap(isAuthenticated => {
        if(!isAuthenticated) {
          // return this.router.navigateByUrl('/login');
          return this.authService.autoLogin();
        } else {
          return of(isAuthenticated);
        }
      }),
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigateByUrl('/tabs/home');
        }
      })
    );
  }
}
