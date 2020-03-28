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
import { PaymentModalComponent } from 'src/app/shared/payment-modal/payment-modal.component';
import {ChoosePayModalComponent} from 'src/app/shared/choose-pay-modal/choose-pay-modal.component';
import { AppRoutingModule } from './app-routing.module';
import { NgxPayPalModule } from 'ngx-paypal';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent, PaymentModalComponent, ChoosePayModalComponent],
  entryComponents: [PaymentModalComponent, ChoosePayModalComponent],
  imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(), SnotifyModule, AppRoutingModule, 
  SnotifyModule, ReactiveFormsModule, FormsModule, NgxPayPalModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
