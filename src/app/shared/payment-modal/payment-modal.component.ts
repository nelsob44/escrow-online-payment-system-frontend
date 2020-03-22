import { Component, OnInit, ViewChild, ElementRef, Input, Renderer2, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {NgForm} from "@angular/forms";
import { AngularStripeService } from '@fireflysemantics/angular-stripe-service';
import { Router } from '@angular/router';
import { BridgeService } from 'src/app/bridge.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss'],
})

export class PaymentModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('paymentmodal', { static: false }) paymentModalElementRef: ElementRef;
  @Input() closeButtonText = 'Cancel';
  @Input() title = 'Continue Payment';

  @ViewChild('cardInfo', {static: false}) cardInfo: ElementRef;

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
        
  }

  
  ngAfterViewInit() {
    this.stripeService.setPublishableKey('pk_test_qkCQMaN7xcuxD4z2rZvZIRDR').then(
    stripe=> {
      this.stripe = stripe;
      const elements = stripe.elements();
      this.card = elements.create('card');
      this.card.mount(this.cardInfo.nativeElement);
      this.card.addEventListener('change', this.cardHandler);
    });
  }

   onCancel() {
    this.modalCtrl.dismiss();
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

  onSubmit(clientSecret: string, buyer: string, buyerEmail: string, itemPrice: number, intent_id: string, currency: string, realAmount: number, description: string, sellerId: number, sellerEmail: string) {
    
    this.intentSub = this.bridgeService.storePaymentIntent(buyer, buyerEmail, itemPrice,
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