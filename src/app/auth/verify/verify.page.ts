import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../user.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { BridgeService } from 'src/app/bridge.service';
import { Verify } from 'src/app/models/verify.model';
import { isArray } from 'util';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
})
export class VerifyPage implements OnInit, OnDestroy {
  profile: User;
  isLoading = false;
  numberCharacters: number = 0;
  loadedSecretCharacters: any = [];
  secretCharactersChosen: any = [];
  private userSub: Subscription;
  private verifySub: Subscription;
  private answerSub: Subscription;
  private verifyData: Verify;
  
  constructor(private bridgeService: BridgeService,
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

  ionViewWillEnter() {
    this.isLoading = true;
    if(this.profile != null) {
      this.verifySub = this.bridgeService.fetchverifysecret(this.profile.id).subscribe(secrets => {
        
        if(secrets) {
          this.verifyData = secrets;
          this.numberCharacters = this.verifyData.numberOfCharacters;
          let minimum = 1;
          let numArray = [];
          let newNumArray = [];
          for(let i = 0; i < this.numberCharacters; i++) {
            numArray.push(i + 1);
          }

          do {
            let number = Math.floor(Math.random() * (this.numberCharacters - minimum + 1)) + minimum;
            if(!newNumArray.includes(number)) {
              newNumArray.push(number);
            }
          } while (newNumArray.length < 3);  

          let newNumArray2 = new Uint32Array(newNumArray);
          newNumArray2 = newNumArray2.sort();
          this.loadedSecretCharacters = newNumArray2;
          
        } else {
          
          this.router.navigate(['/login']);
        }      
        this.isLoading = false;  
      
      });
    } else {
      
      this.router.navigate(['/login']);
    }

  }

  onSelectCharacter(selection: []) {
    this.secretCharactersChosen.push(selection);    
  }

  onSubmit(form: NgForm) {
   
    if(this.secretCharactersChosen.length != 3) {
      this.showAlert('Please enter all values');
      this.secretCharactersChosen = [];
      setTimeout(() => {
        location.reload();
      }, 2000);
      return;
    }
    this.answerSub = this.bridgeService.verifySecretAnswer(this.secretCharactersChosen).subscribe(secrets => {
      
      if(secrets && isArray(secrets)) { 
        this.numberCharacters = 0;
        this.loadedSecretCharacters = [];
        this.secretCharactersChosen = [];       
        this.router.navigate(['/tabs/home']);
      } else {
        this.secretCharactersChosen = [];
        setTimeout(() => {
          location.reload();
        }, 2000);
        this.showAlert(secrets);        
      }      

      this.isLoading = false;      
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
    if(this.verifySub) {
      this.verifySub.unsubscribe();
    }
    if(this.answerSub) {
      this.answerSub.unsubscribe();
    }
    
  }

}
