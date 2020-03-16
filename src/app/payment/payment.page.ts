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
  private usefulEmail: string;
  private emailSub: Subscription;
  loadedPayments: Payment[];
  isLoading = false;
  noMoreNext = false;
  noMorePrev = true;
  page = 1;

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
      this.loadedPayments = payments;      
    });
  }


  ionViewWillEnter() {
    this.isLoading = true;
    this.paymentSub = this.bridgeService.fetchpayments(this.usefulEmail, this.page).subscribe(payments => {
      this.loadedPayments = payments;  
      this.isLoading = false;    
    });
  }

  onCompletePayment(id: number) {
    console.log('complete');
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
            console.log('Confirm Cancel: blah');
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
    if(this.paymentSub || this.emailSub) {
      this.paymentSub.unsubscribe();
      this.emailSub.unsubscribe();
    }
  }

}
