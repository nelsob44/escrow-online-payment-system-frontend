import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Item } from 'src/app/models/item.model';
import { Subscription } from 'rxjs';
import { BridgeService } from 'src/app/bridge.service';
import { Router } from '@angular/router';
import { take, map } from 'rxjs/operators';
import { PaymentModalComponent } from 'src/app/shared/payment-modal/payment-modal.component';
import {ChoosePayModalComponent} from 'src/app/shared/choose-pay-modal/choose-pay-modal.component';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';

 
@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',  
  styleUrls: ['./item.component.scss'],
})
export class Item1Component implements OnInit, OnDestroy {
  @Input() item: Item;
  @ViewChild('payPalConfig', {static: false}) paypalElement: ElementRef;
    
  paypal;
  private paymentIntentSub: Subscription;
  private emailSub: Subscription;
  private statusSub: Subscription;
  private buyerEmail: string;
  private canDelete: boolean = false;
  private showSuccess: boolean = false;
  private useStripe: boolean = true;
  isLoading = false;
  private checkEmailSub: Subscription;
  
  constructor(private loadingCtrl: LoadingController,
  private modalCtrl: ModalController, private bridgeService: BridgeService,
  private router: Router, private authService: AuthService,
  public actionSheetController: ActionSheetController,
  private alertCtrl: AlertController) { }

  ngOnInit() {
    this.emailSub = this.authService.userEmail.subscribe(email => {
      this.buyerEmail = email;
      if(this.buyerEmail === this.item.sellerEmail) {
        this.canDelete = true;
      }
    });

    this.statusSub = this.authService.userStatus.subscribe(status => {
      if(status) {
        if(status > 2) {
          this.canDelete = true;
        }
      }
    });
  }

  async presentActionSheet(id: string) {    
    const actionSheet = await this.actionSheetController.create({
      header: 'Choose Payment Option',
      buttons: [{
        text: 'Pay with Credit/Debit Card',                
        handler: () => {
          this.useStripe = true;
          this.onClickPay(id);
        }      
      }, {
        text: 'Pay with Paypal',        
        handler: () => {
          this.useStripe = false;
          this.onClickPaypal(id);
          console.log('Paypal clicked');
        }      
      }]
    });
    await actionSheet.present();
  }

  private onClickPay(id: string) {    
    this.loadingCtrl.create({keyboardClose: true, message: 'Setting up payment....'})
    .then(loadingEl => {
      loadingEl.present();

      return this.paymentIntentSub = this.bridgeService.addPaymentIntentStripe(
      this.item.id,
      this.item.itemName,
      this.item.itemPrice,
      this.item.currency,
      this.item.buyerName,
      this.item.connectionChannel,
      this.item.itemDescription,
      this.item.itemSerialNo,
      this.item.itemModelNo,
      this.item.imeiFirst,
      this.item.imeiLast
    ).pipe(
      
      map(intent => {        
        this.presentModal(
        intent.intent.id, 
        this.item.id, 
        intent.intent.description,
        intent.intent.amount,
        intent.intent.currency,
        this.item.buyerName,
        this.buyerEmail,
        this.item.itemName,
        intent.intent.client_secret,
        );
      }, errorResponse => {
        const errorCode = errorResponse.error.message;

        this.showAlert(errorCode);
      })
    ).subscribe(() => {
      console.log('success 1');
      loadingEl.dismiss();
        
         
    }, errorResponse => {
        loadingEl.dismiss();
        
        const errorCode = errorResponse.error.errors;
                
        this.showAlert(errorCode);
       
        this.isLoading = false;
      });
    });
    
    
  }

  private onClickPaypal(id: string) {
    this.loadingCtrl.create({keyboardClose: true, message: 'Setting up payment....'})
    .then(loadingEl => {
      loadingEl.present();

      this.checkEmailSub = this.bridgeService.checkEmailVerification().subscribe(data => {
        
        if(data) {
          this.presentModal(null, this.item.id, this.item.itemDescription,
              this.item.itemPrice,
              this.item.currency,
              this.item.buyerName,
              null,
              this.buyerEmail
          );
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

  private presentModal(id: string, 
  itemId: string,
  description: string, 
  amount: any, 
  currency: string,
  buyer: string,
  buyerEmail: string,
  itemName?: string,
  clientSecret?: string,  
  connectionChannel?: string,      
  itemSerialNo?: string,
  itemModelNo?: string,
  imeiFirst?: string,
  imeiLast?: string
  ) {
    
    this.modalCtrl.create({
      component: this.useStripe ? PaymentModalComponent : ChoosePayModalComponent,
      componentProps: {
        'itemId': this.item.id,
        'itemName': this.item.itemName,
        'intent_id': this.useStripe ? id : null,
        'amount': this.useStripe ? amount : (Math.round( ( ((+this.item.itemPrice) + (+this.item.itemPrice * 0.09)) + Number.EPSILON ) * 100 ) / 100),
        'description': description,
        'currency': currency,
        'buyer' : buyer,
        'commission' : this.useStripe ? (amount/100) - (+this.item.itemPrice) : (+this.item.itemPrice * 0.09),
        'itemPrice' : +(this.item.itemPrice),
        'clientSecret' : this.useStripe ? clientSecret : null,
        'buyerEmail' : this.buyerEmail,
        'realAmount': this.useStripe ? (amount/100) : (Math.round( ( (((+this.item.itemPrice) + (+this.item.itemPrice * 0.09)) - ((+this.item.itemPrice) + (+this.item.itemPrice * 0.09)) * 0.04) + Number.EPSILON ) * 100 ) / 100),
        'seller_id': this.item.sellerId,
        'seller_email': this.item.sellerEmail,
        'connectionChannel': this.item.connectionChannel,
        'itemSerialNo': this.item.itemSerialNo,
        'itemModelNo': this.item.itemModelNo,
        'imeiFirst': this.item.imeiFirst,
        'imeiLast': this.item.imeiLast
      }
    }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if(!modalData.data) {
          return;
        }
        
      });
      modalEl.present();
    });
  }

  onDelete(id: string) {
    return this.bridgeService.deleteItem(id).pipe(
      take(1),
      map(dataRes => {        
        console.log('item deleted');        
      })
    ).subscribe(() => {
      console.log('deleted');
    });
  }

 

  ngOnDestroy() {
    if(this.paymentIntentSub) {
      this.paymentIntentSub.unsubscribe();      
    }
    if(this.emailSub) {
      this.emailSub.unsubscribe();
    }
    if(this.checkEmailSub) {
      this.checkEmailSub.unsubscribe();
    }
  }

}
