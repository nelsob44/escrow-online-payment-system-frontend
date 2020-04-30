import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BridgeService } from '../bridge.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Payment } from '../models/payment.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit, OnDestroy {
  private clearCacheSub: Subscription;
  private searchPaymentSub: Subscription;
  isLoading = false;
  isPaid = false;
  form: FormGroup;
  loadedPayment: Payment;

  constructor(private bridgeService: BridgeService,
  private loadingCtrl: LoadingController,
  private router: Router,
  private alertCtrl: AlertController) { }

  ngOnInit() {
    this.form = new FormGroup({
      paymentId: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      })
    });
  }

  onClearCache() {
    this.loadingCtrl.create({keyboardClose: true, message: 'Clearing server cache....'})
    .then(loadingEl => {
      loadingEl.present();

      this.clearCacheSub = this.bridgeService.clearCache().subscribe(data => {
        
        if(data.message) {
          this.showAlert(data.message);
        } 
      loadingEl.dismiss();   
    }, errorResponse => {
        loadingEl.dismiss();
        
        const errorCode = errorResponse.error.errors;
                
        this.showAlert(errorCode);
       
        this.isLoading = false;
      });
    });
  }

  onSearchTransaction() {
    if(!this.form.value.paymentId) {
      return;
    }

    this.loadingCtrl.create({keyboardClose: true, message: 'Searching for transaction....'})
    .then(loadingEl => {
      loadingEl.present();

      this.searchPaymentSub = this.bridgeService.searchpaymentAdmin(this.form.value.paymentId).subscribe(payment => {
        
        if(payment) {
          this.loadedPayment = payment;
          this.isPaid = true;
          this.form.reset();
        }
      loadingEl.dismiss();   
    }, errorResponse => {
        loadingEl.dismiss();
        const errorCode = errorResponse.error.errors;
             
        this.showAlert(errorCode);
         
        this.isLoading = false;
      });
    });
  }

  private showAlert(message: string) {
    this.alertCtrl.create({      
      message: message,
      buttons: ['Okay']
    }).then(alertEl => alertEl.present());
  }

  onClickViewPayments() {
    this.router.navigate(['/payment']);
  }

  ngOnDestroy() {
    if (this.clearCacheSub) {
      this.clearCacheSub.unsubscribe();
      
    }

    if(this.searchPaymentSub) {
      this.searchPaymentSub.unsubscribe();
    }
  }

}
