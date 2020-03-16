import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Item } from '../models/item.model';
import { Subscription } from 'rxjs';
import { BridgeService } from '../bridge.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnDestroy{

  form: FormGroup;
  loadedItems: Item[];
  isLoading = false;
  private itemsSub: Subscription;
  private searchItemSub: Subscription;
  
  constructor(private bridgeService: BridgeService,
  private route: ActivatedRoute, 
  private loadingCtrl: LoadingController,
  private alertCtrl: AlertController,
  private router: Router) {}

  ngOnInit() {
    this.form = new FormGroup({
      itemId: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      })
    });
  }

  onSearchProductCode() {
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


  ngOnDestroy() {

  }

}
