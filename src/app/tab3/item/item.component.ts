import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Item } from 'src/app/models/item.model';
import { Subscription } from 'rxjs';
import { BridgeService } from 'src/app/bridge.service';
import { Router } from '@angular/router';
import { take, map } from 'rxjs/operators';
import { PaymentModalComponent } from 'src/app/shared/payment-modal/payment-modal.component';
import {ChoosePayModalComponent} from 'src/app/shared/choose-pay-modal/choose-pay-modal.component';
import { ModalController, AlertController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit, OnDestroy {
  @Input() item: Item;

  private paymentIntentSub: Subscription;
  private emailSub: Subscription;
  private statusSub: Subscription;
  private buyerEmail: string;
  private canDelete: boolean = false;

  constructor(private modalCtrl: ModalController, private bridgeService: BridgeService,
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
          this.onClickPay(id);
        }      
      }, {
        text: 'Pay with Paypal',        
        handler: () => {
          console.log('Paypal clicked');
        }      
      }]
    });
    await actionSheet.present();
  }

  private onClickPay(id: string) {    
    return this.paymentIntentSub = this.bridgeService.addPaymentIntentStripe(
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
        this.presentModal(intent.intent.id, intent.intent.description,
        intent.intent.amount,
        intent.intent.currency,
        this.item.buyerName,
        intent.intent.client_secret,
        this.buyerEmail);
      }, errorResponse => {
        const errorCode = errorResponse.error.message;

        this.showAlert(errorCode);
      })
    ).subscribe(() => {
      console.log('success 1');
    });
    
  }

  private showAlert(message: string) {
    this.alertCtrl.create({      
      message: message,
      buttons: ['Okay']
    }).then(alertEl => alertEl.present());
  }

  private presentModal(id: string, 
  description: string, 
  amount: number, 
  currency: string,
  buyer: string,
  clientSecret: string,
  buyerEmail: string
  ) {
    this.modalCtrl.create({
      component: PaymentModalComponent,
      componentProps: {
        'intent_id': id,
        'amount': amount,
        'description': description,
        'currency': currency,
        'buyer' : buyer,
        'commission' : (amount/100) - (+this.item.itemPrice),
        'itemPrice' : +(this.item.itemPrice),
        'clientSecret' : clientSecret,
        'buyerEmail' : buyerEmail,
        'realAmount': amount/100,
        'seller_id': this.item.sellerId,
        'seller_email': this.item.sellerEmail
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
  }

}
