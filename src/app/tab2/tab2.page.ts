import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BridgeService } from 'src/app/bridge.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { switchMap, take, map } from 'rxjs/operators';
import { Item } from 'src/app/models/item.model';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for(let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for(let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnDestroy {
  form: FormGroup;  
  filesToUpload: any = [];
  private itemSub: Subscription;
  isLoading = false;

  constructor(private bridgeService: BridgeService,
  private route: ActivatedRoute, 
  private loadingCtrl: LoadingController,
  private alertCtrl: AlertController,
  private router: Router) {}

  ngOnInit() {
    this.form = new FormGroup({
      itemName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      itemPrice: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),      
      currency: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      theImage: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      }),    
      buyerName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      connectionChannel: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      itemDescription: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      itemSerialNo: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      }),
      itemModelNo: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      }),
      imeiFirst: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      }),
      imeiLast: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      }),
    });
  }

  onCreateItem() {
    if(!this.form.value) {
      return;
    }
    this.loadingCtrl.create({keyboardClose: true, message: 'Creating item....'})
    .then(loadingEl => {
      loadingEl.present();

      if(this.filesToUpload.length > 0) {
        return this.itemSub = this.bridgeService.uploadImage(this.filesToUpload).pipe(
          take(1),
          switchMap(paths => {
            
            return this.bridgeService.addItem(
              this.form.value.itemName,
              this.form.value.itemPrice,
              this.form.value.currency,
              paths,
              this.form.value.buyerName,
              this.form.value.connectionChannel,
              this.form.value.itemDescription,
              this.form.value.itemSerialNo,
              this.form.value.itemModelNo,
              this.form.value.imeiFirst,
              this.form.value.imeiLast
            );
          })
        ).subscribe(data => {
          this.filesToUpload = [];
          this.form.reset();     
          const message = `<p>Your item has been created and your search ID has been emailed to you.</p>
                          <p>Search ID: <b>${data.searchId}</b></p>`;
          this.showAlert(message);    
          this.router.navigate(['/tabs/my-items']);
          loadingEl.dismiss();
        }, errorResponse => {
          loadingEl.dismiss();
          console.log(errorResponse);
          const errorCode = errorResponse.error.errors;
          if(errorCode === 'Property [email_verified_at] does not exist on the Eloquent builder instance.') {
            let displayCode = 'Sorry, you need to verify your email first before you can add an item';
            this.showAlert(displayCode);  
          } else {
            this.showAlert(errorCode);
          }
        
          this.isLoading = false;
        });
      } else {
        return this.itemSub = this.bridgeService.addItem(
              this.form.value.itemName,
              this.form.value.itemPrice,
              this.form.value.currency,
              [],
              this.form.value.buyerName,
              this.form.value.connectionChannel,
              this.form.value.itemDescription,
              this.form.value.itemSerialNo,
              this.form.value.itemModelNo,
              this.form.value.imeiFirst,
              this.form.value.imeiLast            
            ).subscribe(data => {
              this.filesToUpload = [];
              this.form.reset();   
              const message = `<p>Your item has been created and your search ID has been emailed to you.</p>
                              <p>Search ID: <b>${data.searchId}</b></p>`;
              this.showAlert(message);         
              this.router.navigate(['/tabs/my-items']);
            loadingEl.dismiss();
        }, errorResponse => {
          console.log(errorResponse);
          loadingEl.dismiss();
          
          const errorCode = errorResponse.error.errors;
          if(errorCode === 'Property [email_verified_at] does not exist on the Eloquent builder instance.') {
            let displayCode = 'Sorry, you need to verify your email first before you can add an item';
            this.showAlert(displayCode);  
          } else {
            this.showAlert(errorCode);
          }   
        
          this.isLoading = false;
        });
      }
    });
  }


  onImagePicked(imageData: string | File) {
    
    let imageFile;
    if(typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(imageData.replace('data:image/png;base64,', ''), 'image/jpeg');
        this.filesToUpload.push(imageFile);
      } catch (error) {
        this.showAlert(error)
        return;
      } 
    } else {
      imageFile = imageData;
      this.filesToUpload.push(imageData);
      // console.log(imageFile);
      // console.log(this.filesToUpload);
      
    }
    this.form.patchValue({ theImage: imageFile });
  }
  private showAlert(message: string) {
    this.alertCtrl.create({      
      message: message,
      buttons: ['Okay']
    }).then(alertEl => alertEl.present());
  }

  ngOnDestroy() {
    if (this.itemSub) {
      this.itemSub.unsubscribe();
    }
  }

}
