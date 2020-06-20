import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Item } from '../models/item.model';
import { Subscription } from 'rxjs';
import { BridgeService } from '../bridge.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, AlertController, Animation, AnimationController} from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { Payment } from '../models/payment.model';
import { trigger, transition, useAnimation, query, style, stagger, animate } from '@angular/animations';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']

})
export class Tab1Page implements OnInit, OnDestroy{
  @ViewChild('list', { read: ElementRef, static: false}) list: ElementRef;
  @ViewChild('list1', { read: ElementRef, static: false}) list1: ElementRef;
  @ViewChild('list2', { read: ElementRef, static: false}) list2: ElementRef;
  @ViewChild('list3', { read: ElementRef, static: false}) list3: ElementRef;
  @ViewChild('list4', { read: ElementRef, static: false}) list4: ElementRef;
  @ViewChild('list5', { read: ElementRef, static: false}) list5: ElementRef;
  @ViewChild('list6', { read: ElementRef, static: false}) list6: ElementRef;
  @ViewChild('list7', { read: ElementRef, static: false}) list7: ElementRef;
  @ViewChild('list8', { read: ElementRef, static: false}) list8: ElementRef;
  @ViewChild('list9', { read: ElementRef, static: false}) list9: ElementRef;
  @ViewChild('list10', { read: ElementRef, static: false}) list10: ElementRef;
  @ViewChild('list11', { read: ElementRef, static: false}) list11: ElementRef;
   @ViewChild('list12', { read: ElementRef, static: false}) list12: ElementRef;
 
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
  listActive = true;
  list1Active = true;
  list2Active = true;
  list3Active = true;
  list4Active = true;
  list5Active = true;
  list6Active = true;
  list7Active = true;
  list8Active = true;
  list9Active = true;
  list10Active = true;
  list11Active = true;
  list12Active = true;
   
  constructor(private bridgeService: BridgeService,
  private route: ActivatedRoute, 
  private loadingCtrl: LoadingController,
  private alertCtrl: AlertController,
  private router: Router,
  private animationCtrl: AnimationController,
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

  async ngAfterViewInit() {
        
    const animation:Animation = this.animationCtrl.create()
    .addElement(this.list.nativeElement)    
    .duration(6000)
    .iterations(1)
    .keyframes([
      { offset: 0, opacity: "1", transform: "translateX(105%)" },
      { offset: 1, transform: "translateX(-105%)", opacity: "1" },
      { offset: 1, transform: "translateX(0)", opacity: "1" }
    ]);
    const animation1:Animation = this.animationCtrl.create()
      .addElement(this.list1.nativeElement)
      .easing("ease-in-out")
      .duration(4000)
      .direction("alternate")
      .iterations(2)
      .keyframes([
        { offset: 0, opacity: "1", transform: "scale(0.5) rotate(0)" },
        { offset: 0.25, transform: "scale(1) rotate(2deg)", opacity: "1" },
        { offset: 0.5, opacity: "1", transform: "scale(0.5) rotate(0)" },
        { offset: 1, transform: "scale(1) rotate(-2deg)", opacity: "1" }
      ]);
    
    const animation2:Animation = this.animationCtrl.create()
      .addElement(this.list2.nativeElement)
      .easing("ease-in-out")
      .duration(4000)
      .direction("alternate")
      .iterations(2)
      .keyframes([
        { offset: 0, opacity: "1", transform: "scale(0.5) rotate(0)" },
        { offset: 0.25, transform: "scale(1) rotate(2deg)", opacity: "1" },
        { offset: 0.5, opacity: "1", transform: "scale(0.5) rotate(0)" },
        { offset: 1, transform: "scale(1) rotate(-2deg)", opacity: "1" }
      ]);

    const animation3:Animation = this.animationCtrl.create()
      .addElement(this.list3.nativeElement)
      .easing("ease-in-out")
      .duration(4000)
      .direction("alternate")
      .iterations(2)
      .keyframes([
        { offset: 0, opacity: "1", transform: "scale(0.5) rotate(0)" },
        { offset: 0.25, transform: "scale(1) rotate(2deg)", opacity: "1" },
        { offset: 0.5, opacity: "1", transform: "scale(0.5) rotate(0)" },
        { offset: 1, transform: "scale(1) rotate(-2deg)", opacity: "1" }
      ]);

    const animation4:Animation = this.animationCtrl.create()
      .addElement(this.list4.nativeElement)
      .easing("ease-in-out")
      .duration(4000)
      .direction("alternate")
      .iterations(2)
      .keyframes([
        { offset: 0, opacity: "1", transform: "scale(0.5) rotate(0)" },
        { offset: 0.25, transform: "scale(1) rotate(2deg)", opacity: "1" },
        { offset: 0.5, opacity: "1", transform: "scale(0.5) rotate(0)" },
        { offset: 1, transform: "scale(1) rotate(-2deg)", opacity: "1" }
      ]);

    const animation5:Animation = this.animationCtrl.create()
      .addElement(this.list5.nativeElement)
      .easing("ease-in-out")
      .duration(4000)
      .direction("alternate")
      .iterations(2)
      .keyframes([
        { offset: 0, opacity: "1", transform: "scale(0.5) rotate(0)" },
        { offset: 0.25, transform: "scale(1) rotate(2deg)", opacity: "1" },
        { offset: 0.5, opacity: "1", transform: "scale(0.5) rotate(0)" },
        { offset: 1, transform: "scale(1) rotate(-2deg)", opacity: "1" }
      ]);

    const animation6:Animation = this.animationCtrl.create()
      .addElement(this.list6.nativeElement)
      .easing("ease-in-out")
      .duration(4000)
      .direction("alternate")
      .iterations(2)
      .keyframes([
        { offset: 0, opacity: "1", transform: "scale(0.5) rotate(0)" },
        { offset: 0.25, transform: "scale(1) rotate(2deg)", opacity: "1" },
        { offset: 0.5, opacity: "1", transform: "scale(0.5) rotate(0)" },
        { offset: 1, transform: "scale(1) rotate(-2deg)", opacity: "1" }
      ]);

    const animation7:Animation = this.animationCtrl.create()
      .addElement(this.list7.nativeElement)
      .easing("ease-in-out")
      .duration(4000)
      .direction("alternate")
      .iterations(2)
      .keyframes([
        { offset: 0, opacity: "1", transform: "scale(0.5) rotate(0)" },
        { offset: 0.25, transform: "scale(1) rotate(2deg)", opacity: "1" },
        { offset: 0.5, opacity: "1", transform: "scale(0.5) rotate(0)" },
        { offset: 1, transform: "scale(1) rotate(-2deg)", opacity: "1" }
      ]);

    const animation8:Animation = this.animationCtrl.create()
      .addElement(this.list8.nativeElement)
      .easing("ease-in-out")
      .duration(6000)
      .direction("alternate")
      .iterations(2)
      .keyframes([
        { offset: 0, opacity: "1", transform: "scale(0.5) rotate(0)" },
        { offset: 0.25, transform: "scale(1) rotate(2deg)", opacity: "1" },
        { offset: 0.5, opacity: "1", transform: "scale(0.5) rotate(0)" },
        { offset: 1, transform: "scale(1) rotate(-2deg)", opacity: "1" }
      ]);

    const animation9:Animation = this.animationCtrl.create()
      .addElement(this.list9.nativeElement)
      .easing("ease-in-out")
      .duration(6000)
      .direction("alternate")
      .iterations(2)
      .keyframes([
        { offset: 0, opacity: "1", transform: "scale(0.5) rotate(0)" },
        { offset: 0.25, transform: "scale(1) rotate(2deg)", opacity: "1" },
        { offset: 0.5, opacity: "1", transform: "scale(0.5) rotate(0)" },
        { offset: 1, transform: "scale(1) rotate(-2deg)", opacity: "1" }
      ]);

    const animation10:Animation = this.animationCtrl.create()
      .addElement(this.list10.nativeElement)
      .easing("ease-in-out")
      .duration(6000)
      .direction("alternate")
      .iterations(2)
      .keyframes([
        { offset: 0, opacity: "1", transform: "scale(0.5) rotate(0)" },
        { offset: 0.25, transform: "scale(1) rotate(2deg)", opacity: "1" },
        { offset: 0.5, opacity: "1", transform: "scale(0.5) rotate(0)" },
        { offset: 1, transform: "scale(1) rotate(-2deg)", opacity: "1" }
      ]);

    const animation11:Animation = this.animationCtrl.create()
      .addElement(this.list11.nativeElement)
      .easing("ease-in-out")
      .duration(6000)
      .direction("alternate")
      .iterations(2)
      .keyframes([
        { offset: 0, opacity: "1", transform: "scale(0.5) rotate(0)" },
        { offset: 0.25, transform: "scale(1) rotate(2deg)", opacity: "1" },
        { offset: 0.5, opacity: "1", transform: "scale(0.5) rotate(0)" },
        { offset: 1, transform: "scale(1) rotate(-2deg)", opacity: "1" }
      ]);
  
  
  
  await animation.play().then(() => {
    this.listActive = false;
  });
  
  await animation1.play().then(() => {
    this.list1Active = false;
  });

  await animation2.play().then(() => {
    this.list2Active = false;
  });

  await animation3.play().then(() => {
    this.list3Active = false;
  });

  await animation4.play().then(() => {
    this.list4Active = false;
  });

  await animation5.play().then(() => {
    this.list5Active = false;
  });

  await animation6.play().then(() => {
    this.list6Active = false;
  });

  await animation7.play().then(() => {
    this.list7Active = false;
  });

  await animation8.play().then(() => {
    this.list8Active = false;
  });

  await animation9.play().then(() => {
    this.list9Active = false;
  });

  await animation10.play().then(() => {
    this.list10Active = false;
  });

  await animation11.play().then(() => {
    this.list11Active = false;
    
    const animation12:Animation = this.animationCtrl.create()
    .addElement(this.list12.nativeElement)    
    .duration(10000)
    .iterations(Infinity)
    .keyframes([
      { offset: 0, opacity: "1", transform: "translateX(105%)" },
      { offset: 1, transform: "translateX(-105%)", opacity: "1" },
      { offset: 1, transform: "translateX(0)", opacity: "1" }
    ]);

    animation12.play();
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

  onExplore() {
    this.router.navigate(['/login']);
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
