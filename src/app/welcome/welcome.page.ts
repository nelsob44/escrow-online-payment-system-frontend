import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BridgeService } from '../bridge.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  form: FormGroup;  
  formtwo: FormGroup;
  userName: string;
  private userNameSub: Subscription;
  isLoggedIn = false;

  constructor(private bridgeService: BridgeService,
  private route: ActivatedRoute, 
  private loadingCtrl: LoadingController,
  private alertCtrl: AlertController,
  private router: Router,
  private authService: AuthService) {}

  ngOnInit() {
    this.form = new FormGroup({
      itemId: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      })
    });

    this.formtwo = new FormGroup({
      itemName: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      }),
      category: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      }),
      itemDescription: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      }),
      itemColour: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      }),
    });


  }
  onCreateItem(){
    this.router.navigate(['/login']);
  }

  addNewItem() {
    console.log('submitted')
  }
  refreshFilter(){
    location.reload();
  }

}
