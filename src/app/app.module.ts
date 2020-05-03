import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ReactiveFormsModule } from '@angular/forms';
import {FormsModule} from '@angular/forms';
import { PaymentModalComponent } from './shared/payment-modal/payment-modal.component';
import {ChoosePayModalComponent} from './shared/choose-pay-modal/choose-pay-modal.component';
import { AppRoutingModule } from './app-routing.module';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
// import { NgxPayPalModule } from 'ngx-paypal';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment.prod';
import { ServiceWorkerModule } from '@angular/service-worker';


@NgModule({
  declarations: [AppComponent, PaymentModalComponent, ChoosePayModalComponent],
  entryComponents: [PaymentModalComponent, ChoosePayModalComponent],
  imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(), AppRoutingModule, 
  SnotifyModule, ReactiveFormsModule, FormsModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService,
    ModalController,
    AlertController,
    LoadingController,
    ActionSheetController
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
