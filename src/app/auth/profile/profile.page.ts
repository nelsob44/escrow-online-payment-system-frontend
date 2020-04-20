import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { User } from '../user.model';
import { Router } from '@angular/router';
import { BridgeService } from 'src/app/bridge.service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  private resendEmailSub: Subscription;
  
  isLoading = false;
  private userSub: Subscription;
  profile: User;

  constructor(private bridgeService: BridgeService,
  private loadingCtrl: LoadingController,
  private router: Router,
  private authService: AuthService,
  private alertCtrl: AlertController) { }

  ngOnInit() {
    this.isLoading = true;
    this.userSub = this.authService.user.subscribe(user => {
      if(user) {
        this.profile = user;
      }
      
      this.isLoading = false; 
    });    
  }

  onEditProfile(profileId: string) {
    this.router.navigate(['/edit-profile/' +  profileId]);
  }

  onClickViewPayments() {
    this.router.navigate(['/payment']);
  }

  
  onClickVerifyEmail(email: string) {
    
    this.loadingCtrl.create({keyboardClose: true, message: 'Resending verification email....'})
    .then(loadingEl => {
      loadingEl.present();

      this.resendEmailSub = this.bridgeService.resendEmailVerification(email).subscribe(data => {
        
        if(data) {
          this.showAlert(data);
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

  ngOnDestroy() {
    if(this.userSub) {
      this.userSub.unsubscribe();
    }
    if(this.resendEmailSub) {
      this.resendEmailSub.unsubscribe();
    }
  }
}
