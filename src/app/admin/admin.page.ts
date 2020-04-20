import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { BridgeService } from '../bridge.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit, OnDestroy {
  private clearCacheSub: Subscription;
  isLoading = false;

  constructor(private bridgeService: BridgeService,
  private loadingCtrl: LoadingController,
  private router: Router,
  private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  onClearCache() {
    this.loadingCtrl.create({keyboardClose: true, message: 'Clearing server cache....'})
    .then(loadingEl => {
      loadingEl.present();

      this.clearCacheSub = this.bridgeService.clearCache().subscribe(data => {
        
        if(data.message) {
          this.showAlert(data.message);
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

  onClickViewPayments() {
    this.router.navigate(['/payment']);
  }

  ngOnDestroy() {
    if (this.clearCacheSub) {
      this.clearCacheSub.unsubscribe();
      
    }
  }

}
