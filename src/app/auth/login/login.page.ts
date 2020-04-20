import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from '../auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isLogin = true;
  isLoading = false;
  

  constructor(
    private authService: AuthService, 
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }
  selectedColourPalette = 1;
  colourPaletteOne = {
    primary: 'blue', 
    secondary: 'grey',    
  }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {    
    if (!form.valid) {
      return;
    }
    const firstname = form.value.firstname;
    const lastname = form.value.lastname;
    const email = form.value.email;
    const password = form.value.password;
    const confirmpassword = form.value.confirmpassword;
    const country = form.value.country;
    const terms = form.value.terms;
    const secretquestion = form.value.secretquestion;
    const secretanswer = form.value.secretanswer;
    const phone = form.value.phone;
    

    if (!this.isLogin) {
      if(!terms) {
        this.showAlert('You need to agree to terms and conditions to proceed');
        return;
      }

      if(form.value.password !== form.value.confirmpassword) {
        this.showAlert('Your passwords do not match. Please enter and confirm your password again');
        return;
      }
    }

    this.isLoading = true;
    this.loadingCtrl.create({keyboardClose: true, message: this.isLogin ? 'Logging in....' : 'Signing up....' })
    .then(loadingEl => {
      loadingEl.present();
      
      let authObs: Observable<AuthResponseData>;

      if(!this.isLogin) {
        
        authObs = this.authService.signup(firstname, lastname, email, password, confirmpassword, country, secretquestion, secretanswer, phone);
      }
      else {
        authObs = this.authService.login(email, password);
      }    
      
      return authObs.subscribe(resData => {
        
        loadingEl.dismiss();
        this.isLoading = false;
        form.reset();
        if (!this.isLogin) {
          this.router.navigateByUrl('/tabs/home');
          this.showAlert('Account created. You can now proceed to log in');
          this.isLogin = true;
        } else {
          this.router.navigateByUrl('/verify');
          this.showAlert('You are now logged in');          
        }
        
      }, errorResponse => {
        loadingEl.dismiss();
        
        const errorCode = errorResponse.error.error;

        this.showAlert('Sorry, this email has already been used. Try with a different email');
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

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }  

}

