import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BridgeService } from '../bridge.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonInfiniteScroll, IonInput, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Item } from '../models/item.model';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy  {
  form: FormGroup;
  loadedItems: Item[];
  isLoading = false;
  noMoreNext = false;
  noMorePrev = true;
  page = 1;
  private itemsSub: Subscription;
  private searchItemSub: Subscription;
  
  
  constructor(private bridgeService: BridgeService,
  private route: ActivatedRoute, 
  private loadingCtrl: LoadingController,
  private alertCtrl: AlertController,
  private router: Router) {}
  
  nextPage() {
    
    this.page++; 
    this.isLoading = true;
    this.itemsSub = this.bridgeService.fetchitems(this.page).subscribe(items => {
      if(items.length > 0 ) {
        this.loadedItems = items;
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
    this.itemsSub = this.bridgeService.fetchitems(this.page).subscribe(items => {
      this.loadedItems = items;
      
      this.isLoading = false; 
           
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
      this.loadedItems = items;
      
      this.isLoading = false;  
     
    });     
  }

  onSearchItem() {
    if(!this.form.valid) {
      return;
    }
    
    this.loadingCtrl.create({keyboardClose: true, message: 'Searching....'})
    .then(loadingEl => {
      loadingEl.present();

      this.searchItemSub = this.bridgeService.searchitem(this.form.value.itemId).subscribe(item => {
        console.log(item);
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

  searchData() {
    console.log('searching');
  }

  ngOnDestroy() {
    if(this.itemsSub) {
      this.itemsSub.unsubscribe();
    }
  }

}
