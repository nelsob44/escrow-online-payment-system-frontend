import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, ResetData } from '../../auth.service';
import { LoadingController, AlertController } from '@ionic/angular';


@Component({
  selector: 'app-request-reset',
  templateUrl: './request-reset.page.html',
  styleUrls: ['./request-reset.page.scss'],
})
export class RequestResetPage implements OnInit {
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    this.authService.sendPasswordResetLink(email).subscribe(data => {
      this.showAlert(data.message);
    }, error => {
      this.showAlert('Sorry there was an error. please try again later or contact Admin');
    });
  }

  private showAlert(message: any) {
    this.alertCtrl.create({      
      message: message,
      buttons: ['Okay']
    }).then(alertEl => alertEl.present());
  }

}
