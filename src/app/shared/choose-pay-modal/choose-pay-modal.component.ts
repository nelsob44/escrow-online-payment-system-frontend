import { Component, OnInit, ViewChild, ElementRef, Input, Renderer2, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ModalController, AlertController } from '@ionic/angular';
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
export class ChoosePayModalComponent implements OnInit, OnDestroy {
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
  
  constructor(private modalCtrl: ModalController, private renderer: Renderer2,
  private cd: ChangeDetectorRef, private router: Router,    
    private bridgeService: BridgeService,
    private alertCtrl: AlertController,
    private authService: AuthService) { }
  
    ngOnInit(){      
      console.log('description is ' + this.description);
      this.initConfig(); 
    }
 
    private initConfig(): void {
      
      const url = environment.baseUrl;
        this.payPalConfig = {
            currency: this.currency,
            clientId: environment.paypalClientId,
            createOrderOnClient: (data) => <ICreateOrderRequest>{
              intent: 'CAPTURE',
              purchase_units: [{
                amount: {
                  currency_code: this.currency,
                  value: this.amount,
                  breakdown: {
                    item_total: {
                      currency_code: this.currency,
                      value: this.amount
                    }
                  }
                },
                items: [{
                  name: this.itemName,
                  quantity: '1',
                  category: 'PHYSICAL_GOODS',
                  unit_amount: {
                    currency_code: this.currency,
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
                console.log('onApprove - transaction was approved, but not authorized', data, actions);
                this.orderId = data.orderID;                
                actions.order.get().then(details => {
                    console.log('onApprove - you can get full order details inside onApprove: ', details);                    
                }); 
            },
            onClientAuthorization: (data) => {
                console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
                this.showSuccess = true;                
            },
            onCancel: (data, actions) => {
                console.log('OnCancel', data, actions);
                this.showCancel = true;
 
            },
            onError: err => {
                console.log('OnError', err);
                this.showError = true;
            },
            onClick: (data, actions) => {
                console.log('onClick', data, actions);
                // resetStatus();
            },
        };
      }

    onCancelModal() {
      console.log('cancelled modal');
      if(this.orderId !== null) {
        this.savetransactionToServer(this.orderId);
      } else {
        this.modalCtrl.dismiss();
      }
      
    }

    public savetransactionToServer(orderid: string) {
      console.log(this.orderId);
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
        console.log(data);
        this.modalCtrl.dismiss();
      });
    }

    ngOnDestroy() {
    if(this.saveApproveSub) {
      this.saveApproveSub.unsubscribe();
    }    
  }

  }

