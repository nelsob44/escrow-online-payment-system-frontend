import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { User } from '../../user.model';
import { Subscription } from 'rxjs';
import { BridgeService } from 'src/app/bridge.service';
import { take, switchMap } from 'rxjs/operators';

function base64toBlob(dataUrl, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(dataUrl);
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
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit, OnDestroy {
  form: FormGroup;
  profileId: string;
  user: User;
  filesToUpload: any = [];

  private userSub: Subscription;
  private profileSub: Subscription;

  constructor(private authService: AuthService, 
  private bridgeService: BridgeService,
  private route: ActivatedRoute,
  private alertCtrl: AlertController, 
  private router: Router) { }

  
  ngOnInit() {

    this.route.paramMap.subscribe(paramMap => {
      if(paramMap.has('profileId')) {
        this.profileId = paramMap.get('profileId');
        this.userSub = this.authService.user.subscribe(user => {
          this.user = user;
            this.form = new FormGroup({
              firstname: new FormControl(this.user.firstname, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.min(1)]
              }),
              lastname: new FormControl(this.user.lastname, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.min(1)]
              }),
              theImage: new FormControl(this.user.profile_pic, {
                updateOn: 'blur',
                validators: []
              }),
              phone: new FormControl(this.user.phone, {
                updateOn: 'blur',
                validators: []
              }),
              country: new FormControl(this.user.country, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.min(1)]
              })
            });
        });
      } else {
        this.router.navigate(['/tabs/home']);
      }
    });
  }

  onEditUser() {
    if(!this.form.valid) {
      return;
    }
    
    if(this.filesToUpload.length > 0) {
      return this.profileSub = this.bridgeService.uploadImage(this.filesToUpload).pipe(
        take(1),
        switchMap(paths => {

          return this.authService.updateProfile(
            this.form.value.firstname,
            this.form.value.lastname,
            paths,
            this.form.value.phone,
            this.form.value.country
          );
        })
      ).subscribe(() => {
        this.filesToUpload = [];
        this.form.reset();        
        this.router.navigate(['/profile']);
      });

    } else {
        return this.profileSub = this.authService.updateProfile(
        this.form.value.firstname,
        this.form.value.lastname,
        [],
        this.form.value.phone,
        this.form.value.country
      ).pipe(
        take(1)
      ).subscribe(() => {
        this.form.reset();
        this.router.navigate(['/profile']);
      });

    }

  }

  onImagePicked(imageData: string | File) {
    
    let imageFile;
    if(typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(imageData.replace('data:image/png;base64,', ''), 'image/jpeg');
        this.filesToUpload.push(imageFile);
      } catch (error) {
        console.log(error);
        return;
      } 
    } else {
      imageFile = imageData;
      this.filesToUpload.push(imageData);
            
    }
    this.form.patchValue({ theImage: imageFile });
  }

  ngOnDestroy() {
    if(this.userSub) {
      this.userSub.unsubscribe();
      this.profileSub.unsubscribe();
    }
  }

}
