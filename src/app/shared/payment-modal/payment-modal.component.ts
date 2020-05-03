import { Component, OnInit, ViewChild, ElementRef, Input, Renderer2, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {NgForm} from "@angular/forms";
import { AngularStripeService } from '@fireflysemantics/angular-stripe-service';
import { Router } from '@angular/router';
import { BridgeService } from '../../bridge.service';
import { Subscription } from 'rxjs';
// import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss'],
})

export class PaymentModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('paymentmodal', { static: true }) paymentModalElementRef: ElementRef;
  @Input() closeButtonText = 'Cancel';
  @Input() title = 'Continue Payment';
  @Input() currency: string;
  @Input() commission: number;
  @Input() itemPrice: number;
  @Input() amount: number;
  @Input() itemId: string;
  @Input() clientSecret: string;
  @Input() buyer: string;
  @Input() intent_id: string;
  @Input() realAmount: number;
  @Input() description: string;
  @Input() seller_id: number;
  @Input() buyerEmail: string;
  @Input() seller_email: string;

  @ViewChild('cardInfo', {static: true}) cardInfo: ElementRef;
  // public payPalConfig ? : IPayPalConfig;
  stripe;
  loading = false;
  confirmation;

  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;
  private intentSub: Subscription;
  private savePaymentSub: Subscription;
  form: FormGroup;
  
  constructor(private modalCtrl: ModalController, private renderer: Renderer2,
  private cd: ChangeDetectorRef, private router: Router,
    private stripeService:AngularStripeService,
    private bridgeService: BridgeService,
    private alertCtrl: AlertController) { 
    
  }
  
  ngOnInit() {
        console.log('pay-modal ng oninit', this.currency);
  }

  
  ngAfterViewInit() {
    console.log('pay-modal ngafter viewinit');
    const stripePubKey = environment.publishableKeyStripe;
    this.stripeService.setPublishableKey(stripePubKey).then(
    stripe=> {
      this.stripe = stripe;
      const elements = stripe.elements();
      this.card = elements.create('card');
      this.card.mount(this.cardInfo.nativeElement);
      this.card.addEventListener('change', this.cardHandler);
    });
  }

   async onCancel() {
    await this.modalCtrl.dismiss();
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  private showAlert(message: string) {
    this.alertCtrl.create({      
      message: message,
      buttons: ['Okay']
    }).then(alertEl => alertEl.present());
  }

  onSubmit(itemId: string, clientSecret: string, buyer: string, buyerEmail: string, itemPrice: number, intent_id: string, currency: string, realAmount: number, description: string, sellerId: number, sellerEmail: string) {
    
    this.intentSub = this.bridgeService.storePaymentIntent(itemId, buyer, buyerEmail, itemPrice,
      intent_id, currency, realAmount, description, sellerId, sellerEmail
    ).subscribe(() => {
      this.stripe.confirmCardPayment(clientSecret, {
        receipt_email: buyerEmail,
        payment_method: {
          card: this.card,
          billing_details: {
            name: buyer,
            email: buyerEmail
          }
        }
      }).then(res => {
        
        if(res.paymentIntent && res.paymentIntent.status === "succeeded") {
          this.onCancel();
          this.showAlert('Your payment was successful!');
          this.router.navigate(['/payment']);
        } else {
          
          const errorCode = res.error.message;

          this.showAlert(errorCode);  
        }
      });  
    })    
  }

  ngOnDestroy() {
    if (this.intentSub) {
      this.intentSub.unsubscribe();      
    }
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }
  
}