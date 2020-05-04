import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, ResetData } from '../../auth.service';
import { LoadingController, AlertController } from '@ionic/angular';


@Component({
  selector: 'app-response-reset',
  templateUrl: './response-reset.page.html',
  styleUrls: ['./response-reset.page.scss'],
})
export class ResponseResetPage implements OnInit {
  resetToken = null;
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,    
    private route: ActivatedRoute
  ) { 
    route.queryParams.subscribe(params => {
      this.resetToken = params['token']
    });
  }

  ngOnInit() {
    
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const passwordConfirmation = form.value.passwordConfirmation;
    const password = form.value.password;
    if (passwordConfirmation != password)
    {
      this.showAlert('Your Passwords do not match. Please check again');
      return;
    }
    
    
    const email = form.value.email;
    const resetToken = this.resetToken;
    this.authService.changePassword(password, email, resetToken).subscribe(
      data => {
        form.reset();
        
        this.showAlert(data);
      },
      error => {
        
        this.showAlert('Sorry there was an error. please try again later or contact Admin');
      }
    );
  }

  private showAlert(message: string) {
    this.alertCtrl.create({      
      message: message,
      buttons: ['Okay']
    }).then(alertEl => alertEl.present());
  }

}
