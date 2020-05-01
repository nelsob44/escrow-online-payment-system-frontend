import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BridgeService } from '../bridge.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonInfiniteScroll, IonInput, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Item } from '../models/item.model';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy  {
  form: FormGroup;
  loadedItems: Item[];
  isLoading = false;
  noMoreNext = true;
  noMorePrev = true;
  page = 1;
  private itemsSub: Subscription;
  private searchItemSub: Subscription;
  userName: string;
  private userNameSub: Subscription;
  isLoggedIn = false;
  
  constructor(private bridgeService: BridgeService,
  private route: ActivatedRoute, 
  private loadingCtrl: LoadingController,
  private alertCtrl: AlertController,
  private router: Router,
  private authService: AuthService) {}
  
  nextPage() {
    this.page++; 
    this.isLoading = true;
    this.itemsSub = this.bridgeService.fetchitems(this.page).subscribe(items => {
      if(items.length > 0 ) {
        this.loadedItems = items;
        this.noMorePrev = true;
      } else {
        this.page--;
        this.noMoreNext = true;
        this.noMorePrev = false;
      }
            
      this.isLoading = false; 
           
    });
  }

  prevPage() {
    this.page--;
    this.noMoreNext = false;
    this.isLoading = true;
    this.itemsSub = this.bridgeService.fetchitems(this.page).subscribe(items => {
      this.loadedItems = items;
      
      this.isLoading = false; 
      if(this.page == 1 || this.page == 0) {
        this.noMorePrev = true;
        this.page = 1;
      }
           
    });
  }

  ngOnInit() {
    this.form = new FormGroup({
      itemId: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      })
    });

    this.itemsSub = this.bridgeService.items.subscribe(items => {
      this.loadedItems = items;
    })    
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.itemsSub = this.bridgeService.fetchitems(1).subscribe(items => {
      if(items) {
        this.loadedItems = items;
        if(this.loadedItems.length > 1) {
          this.noMoreNext = false;
        }
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

  refreshFilter() {    
    this.ionViewWillEnter();
  }

  onSearchItem() {
    if(!this.form.valid) {
      return;
    }
    
    this.loadingCtrl.create({keyboardClose: true, message: 'Searching....'})
    .then(loadingEl => {
      loadingEl.present();

      this.searchItemSub = this.bridgeService.searchitem(this.form.value.itemId).subscribe(item => {
        
        if(item === "The search was not found") {
          this.showAlert("The search was not found");
        } else {
          this.loadedItems = [];
          this.loadedItems.push(item); 
          this.form.reset();
        }
      loadingEl.dismiss();   
    }, errorResponse => {
        loadingEl.dismiss();
        const errorCode = errorResponse.error.message;
        const errorMessage = "Sorry, the item with ID" + " " + "<b>" + this.form.value.itemId + "</b>" + " " + "was not found.";

        
        if (errorCode.includes("No query results for model [App\\SearchId]")) {
          
            this.showAlert(errorMessage);
        }     
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

  onCreateItem() {
    this.router.navigate(['/tabs/add-product']);
  }

  onClickViewPayments() {
    this.router.navigate(['/payment']);
  }

  searchData() {
    console.log('searching');
  }

  ngOnDestroy() {
    if(this.itemsSub) {
      this.itemsSub.unsubscribe();
    }
    if(this.searchItemSub) {
      this.searchItemSub.unsubscribe();
    }
    if(this.userNameSub) {
      this.userNameSub.unsubscribe();
    }
  }

}
