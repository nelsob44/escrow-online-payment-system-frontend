import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Payment } from '../models/payment.model';
import { BridgeService } from '../bridge.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit, OnDestroy {
  private paymentSub: Subscription;
  private sendPaymentSub: Subscription;
  private usefulEmail: string;
  private emailSub: Subscription;
  loadedPayments: Payment[];
  isLoading = false;
  noMoreNext = false;
  noMorePrev = true;
  page = 1;
  private userName: string;
  private userNameSub: Subscription;
  isLoggedIn = false;
  hasPayments = false;

  constructor(private bridgeService: BridgeService,
  private route: ActivatedRoute, 
  private loadingCtrl: LoadingController,
  private alertCtrl: AlertController,
  private authService: AuthService,
  private router: Router) { }

  ngOnInit() {
    this.emailSub = this.authService.userEmail.subscribe(email => {
      this.usefulEmail = email;
    })
  }

  nextPage() {
    
    this.page++; 
    this.isLoading = true;
    this.paymentSub = this.bridgeService.fetchpayments(this.usefulEmail, this.page).subscribe(payments => {
      if(payments.length > 0 ) {
        this.hasPayments = true;
        this.loadedPayments = payments;
        this.noMorePrev = false;
      } else {
        this.page--;
        this.noMoreNext = true;
      }
            
      this.isLoading = false; 
           
    });
  }

  prevPage() {
    if(this.page == 1) {
      this.noMorePrev = true;
      return;
    }
    this.page--;
    this.noMoreNext = false;
    this.isLoading = true;
    this.paymentSub = this.bridgeService.fetchpayments(this.usefulEmail, this.page).subscribe(payments => {
      this.hasPayments = true;
      this.loadedPayments = payments;      
    });
  }


  ionViewWillEnter() {
    this.isLoading = true;
    this.paymentSub = this.bridgeService.fetchpayments(this.usefulEmail, this.page).subscribe(payments => {
     
      if(payments && payments.length > 0) {
        this.hasPayments = true;
        this.loadedPayments = payments;  
      }
      this.isLoading = false;    
    });
    this.userNameSub = this.authService.userName.subscribe(userName => {
      if(userName) {
        this.userName = userName;
        this.isLoggedIn = true;
      }        
    });
  }
  onClickViewItems() {
    this.router.navigate(['/tabs/my-items']);
  }

  onCreateItem() {
    this.router.navigate(['/tabs/add-product']);
  }

  private onCompletePayment(id: number) {
    this.loadingCtrl.create({keyboardClose: true, message: 'Initiating payout....'})
    .then(loadingEl => {
      loadingEl.present();

      this.sendPaymentSub = this.bridgeService.sendSellerPayment(id).subscribe(data => {
        
        if(data) {
          this.showAlert(data.message);
          setTimeout(() => {
            location.reload();
          },3000);
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

  async presentAlertConfirm(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm release of funds?',
      message: 'Are you sure you wish to release the seller\'s funds to them?',      
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.onCompletePayment(id);
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnDestroy() {
    if(this.paymentSub) {
      this.paymentSub.unsubscribe();
      
    }
    if(this.emailSub) {
      
      this.emailSub.unsubscribe();
    }
    if(this.sendPaymentSub) {
      this.sendPaymentSub.unsubscribe();
      
    }
  }

}
