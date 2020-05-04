import { Component, OnInit, ViewChild, ElementRef, Input, Renderer2, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { BridgeService } from 'src/app/bridge.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { AuthService } from 'src/app/auth/auth.service';
import { take, switchMap, tap, map } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';

@Component({
  selector: 'app-choose-pay-modal',
  templateUrl: './choose-pay-modal.component.html',
  styleUrls: ['./choose-pay-modal.component.scss'],
})
export class ChoosePayModalComponent implements OnInit {
  @ViewChild('choosepaymentmodal', { static: false }) choosePaymentModalElementRef: ElementRef;
  @Input() closeButtonText = 'Cancel';
  @Input() title = 'Choose Payment Option';
  @Input() itemId: string;
  @Input() itemName: string;
  @Input() amount: any;
  @Input() description: string;
  @Input() currency: string;
  @Input() buyer: string;
  @Input() commission: number;
  @Input() itemPrice: number;
  @Input() buyerEmail: string;
  @Input() realAmount: number;
  @Input() seller_id: any;
  @Input() seller_email: string;
  @Input() connectionChannel: string;
  @Input() itemSerialNo: string;
  @Input() itemModelNo: string;
  @Input() imeiFirst: string;
  @Input() imeiLast: string;

  payPalConfig: IPayPalConfig;
  showSuccess: boolean = false;
  showCancel: boolean = false;
  showError: boolean = false;
  public orderId: string = null;
  saveApproveSub: Subscription;
  saveCompleteOrderSub: Subscription;

  constructor(private modalCtrl: ModalController, private renderer: Renderer2,
  private cd: ChangeDetectorRef, private router: Router,    
    private bridgeService: BridgeService,
    private alertCtrl: AlertController,
    private authService: AuthService) { }
  
    ngOnInit(){      
      
      this.initConfig(); 
    }
 
    private async initConfig(){
      
      const url = environment.baseUrl;
        this.payPalConfig = await {
            currency: this.currency.trim(),
            clientId: environment.paypalClientId,
            createOrderOnClient: (data) => <ICreateOrderRequest>{
              intent: 'CAPTURE',
              purchase_units: [{
                amount: {
                  currency_code: this.currency.trim(),
                  value: this.amount,
                  breakdown: {
                    item_total: {
                      currency_code: this.currency.trim(),
                      value: this.amount
                    }
                  }
                },
                items: [{
                  name: this.itemName,
                  quantity: '1',
                  category: 'PHYSICAL_GOODS',
                  unit_amount: {
                    currency_code: this.currency.trim(),
                    value: this.amount,
                  },
                }]
              }]
            },
            advanced: {
                commit: 'true'
            },
            style: {
                label: 'paypal',
                layout: 'vertical'
            },
            
            onApprove: (data, actions) => {
                
                this.orderId = data.orderID;    
                this.saveApprovedTransactionToServer(this.orderId);
                actions.order.get().then(details => {
                    console.log('onApproved');                    
                }); 
            },
            onClientAuthorization: (data) => {
                this.showSuccess = true;  
                this.saveCompleteTransactionToServer(this.orderId);
            },
            onCancel: (data, actions) => {
                console.log('cancelled');
                this.showCancel = true;
 
            },
            onError: err => {                
                this.showAlert('Sorry, paypal is currently unable to process your payment at this time. Please try again later');
                this.showError = true;
            },
            onClick: (data, actions) => {
                console.log('clicked');                
            },
        };
        
      }

    onCancelModal() {
      
      if(this.orderId !== null) {
        if(this.showSuccess) {          
          
          setTimeout(() => {
            this.modalCtrl.dismiss();
            
          },500);          
        }
        
        setTimeout(() => {
          this.modalCtrl.dismiss();
        },500);
      } else {
        setTimeout(() => {
          this.modalCtrl.dismiss();
        },500);        
      }      
    }

    private showAlert(message: string) {
    this.alertCtrl.create({      
      message: message,
      buttons: ['Okay']
    }).then(alertEl => alertEl.present());
  }

    public saveApprovedTransactionToServer(orderid: string) {
      
      return this.saveApproveSub = this.bridgeService.addPaypalApprovedOrder(
        orderid,
        this.itemId,
        this.itemName,
        this.amount.toString(),
        this.description,
        this.currency,
        this.buyer,
        this.commission.toString(),
        this.itemPrice.toString(),
        this.buyerEmail,
        this.realAmount.toString(),
        this.seller_id.toString(),
        this.seller_email,
        this.connectionChannel,
        this.itemSerialNo,
        this.itemModelNo,
        this.imeiFirst,
        this.imeiLast
      ).subscribe(data => {
          console.log('approved'); 
      });
    }

    saveCompleteTransactionToServer(orderId: string) {
      return this.saveCompleteOrderSub = this.bridgeService.completePaypalOrder(
        orderId
        ).subscribe(data => {
          if(data) {
            this.showSuccess = true;
            console.log(data); 
            this.showAlert('Your payment was successful!');
          } else {
            this.showAlert('Sorry, something went wrong. Check the payments page to confirm your payment was successful or not');
          }          
      });
      
    }

    ngOnDestroy() {
      if(this.saveApproveSub) {
        this.saveApproveSub.unsubscribe();
      } 

      if(this.saveCompleteOrderSub) {
        this.saveCompleteOrderSub.unsubscribe();
      }  

      if(this.showSuccess) {
        this.router.navigate(['/payment']);
      } 
    }
}

