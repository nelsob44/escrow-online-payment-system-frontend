import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { User } from '../user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  isLoading = false;
  private userSub: Subscription;
  profile: User;

  constructor(private router: Router,
  private authService: AuthService) { }

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

  ngOnDestroy() {
    if(this.userSub) {
      this.userSub.unsubscribe();
    }
    
  }


}
