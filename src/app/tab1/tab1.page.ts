import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Item } from '../models/item.model';
import { Subscription } from 'rxjs';
import { BridgeService } from '../bridge.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { Payment } from '../models/payment.model';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnDestroy{

  form: FormGroup;
  loadedItems: Item[];
  isLoading = false;
  private searchItemSub: Subscription;
  userName: string;
  private userNameSub: Subscription;
  private searchPaymentSub: Subscription;
  isLoggedIn = false;
  isPaid = false;
  loadedPayment: Payment;
  
  constructor(private bridgeService: BridgeService,
  private route: ActivatedRoute, 
  private loadingCtrl: LoadingController,
  private alertCtrl: AlertController,
  private router: Router,
  private authService: AuthService) {}

  ngOnInit() {
    this.form = new FormGroup({
      itemId: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      }),
      paymentId: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      })
    });
  }

  ionViewWillEnter() {
    this.userNameSub = this.authService.userName.subscribe(userName => {
      if(userName) {
        this.userName = userName;
        this.isLoggedIn = true;
      }        
    });
  }

  refreshFilter() {    
    this.loadedItems = [];
    this.loadedPayment = null;
    this.form.reset();
  }

  onSearchProductCode() {
    if(!this.form.value.itemId) {
      return;
    }
    
    this.loadingCtrl.create({keyboardClose: true, message: 'Searching for item....'})
    .then(loadingEl => {
      loadingEl.present();

      this.searchItemSub = this.bridgeService.searchitem(this.form.value.itemId).subscribe(item => {
        
        if(item) {          
          this.loadedItems = [];
          this.loadedItems.push(item); 
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

  onSearchTransaction() {
    if(!this.form.value.paymentId) {
      return;
    }

    this.loadingCtrl.create({keyboardClose: true, message: 'Searching for transaction....'})
    .then(loadingEl => {
      loadingEl.present();

      this.searchPaymentSub = this.bridgeService.searchpayment(this.form.value.paymentId).subscribe(payment => {
        
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

  onCreateItem() {
    this.router.navigate(['/tabs/add-product']);
  }

  onClickViewPayments() {
    this.router.navigate(['/payment']);
  }

  private showAlert(message: string) {
    this.alertCtrl.create({      
      message: message,
      buttons: ['Okay']
    }).then(alertEl => alertEl.present());
  }


  ngOnDestroy() {
    if(this.searchPaymentSub) {
      this.searchPaymentSub.unsubscribe();
    }
    if(this.searchItemSub) {
      this.searchItemSub.unsubscribe();
    }

    if(this.userNameSub) {
      this.userNameSub.unsubscribe();
    }

  }

}
