import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, ResetData } from '../../auth.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-request-reset',
  templateUrl: './request-reset.page.html',
  styleUrls: ['./request-reset.page.scss'],
})
export class RequestResetPage implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private notify: SnotifyService
  ) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    this.authService.sendPasswordResetLink(email).subscribe(
      data => console.log(data),
      error => this.notify.error(error.error.error)
    );
  }

  private showAlert(message: string) {
    this.alertCtrl.create({      
      message: message,
      buttons: ['Okay']
    }).then(alertEl => alertEl.present());
  }

}