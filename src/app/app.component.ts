import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';

import { Platform } from '@ionic/angular';
import { Plugins, Capacitor } from '@capacitor/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  private authSub: Subscription;
  previousAuthState = false;

  constructor(
    private platform: Platform,
    private menu: MenuController,
    private splashScreen: SplashScreen,
    private authService: AuthService,
    private statusBar: StatusBar,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      // this.splashScreen.hide();
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    });
  }

  ngOnInit() {
    this.authSub = this.authService.user.subscribe(user => {      
      if(user) {
        this.previousAuthState = true;
      }      
    });
  }

  ngOnDestroy() {
    if(this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  login() {
    this.router.navigateByUrl('/login');
  }   

  onLogout() {
    this.authService.logout();  
    this.router.navigateByUrl('/login');  
  }
}
