import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError, map, take, switchMap } from 'rxjs/operators';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { Plugins } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

export interface AuthResponseData {  
  access_token: string;
  expires_in: number;
  token_type: string;
  user_info: User;  
}

export interface ResetData {  
  access_token: string;  
}

@Injectable({
  providedIn: 'root'
})

export class AuthService implements OnDestroy {
  private _user = new BehaviorSubject<User>(null);
  private tokenUrl = environment.baseUrl + '/login';
  private activeLogoutTimer: any;

  get user() {
    return this._user.asObservable();
  }

  get token() {
    return this._user.asObservable().pipe(
      map(user => {
        if(user) {
          return user.token;
        } else {
          return null;
        }
      })
    );
  }

  get userId() {
    return this._user.asObservable().pipe(
      map(user => {
        if(user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

  get userName() {
    return this._user.asObservable().pipe(
      map(user => {
        if(user) {
          return user.firstname + ' ' + user.lastname;
        } else {
          return null;
        }
      })
    );
  }

  get userEmail() {
    return this._user.asObservable().pipe(
      map(user => {
        if(user) {
          return user.email;
        } else {
          return null;
        }
      })
    );
  }

  get userStatus() {
    return this._user.asObservable().pipe(
      map(user => {
        if(user) {
          return user.status;
        } else {
          return null;
        }
      })
    );
  }

  get isAdmin() {
    return this._user.asObservable().pipe(
      map(user => {
        if(user) {
          
          const loginStatus = user.status;
          
          if(loginStatus > 2) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      })
    );
  }

  get isLoggedIn() {
    return this._user.asObservable().pipe(
      map(user => {
        if(user) {
          let payloadVal = user.token.split('.')[1];
          let payloadValue = JSON.parse(atob(payloadVal));
          
          if (payloadValue.iss === this.tokenUrl) {
            return true;
          } else {
            return false;
          }

        } else {
          return false;
        }
      })
    );
  }
 
  
  constructor(private http: HttpClient, 
  private alertCtrl: AlertController,
  private router: Router
  ) { }

  autoLogin() {
    return from(Plugins.Storage.get({key: 'authData'})).pipe(
      map(storedData => {
        if(!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          userId: string,
          firstname: string,
          lastname: string,
          email: string,
          status: number,
          country: string,
          phone: string,
          profile_pic: string,
          flag: string,
          token: string,
          tokenExpirationDate: string
        };
        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if(expirationTime <= new Date()) {
          return null;
        }
        const user = new User(
          parsedData.userId,
          parsedData.firstname,
          parsedData.lastname,
          parsedData.email,
          parsedData.status,
          parsedData.country,
          parsedData.phone,
          parsedData.profile_pic,
          parsedData.flag,
          parsedData.token,
          expirationTime
        );
        return user;
      }),
      tap(user => {
        if(user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

  signup(firstname: string, lastname: string, email: string, password: string, confirmpassword: string, country: string) {
    let newUser = {firstname: firstname, lastname: lastname, email: email, password: password, confirmpassword: confirmpassword, country: country };
    const url = environment.baseUrl + '/signup';
    return this.http.post<AuthResponseData>(url, JSON.stringify(newUser), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(tap(resData => {
      
      return resData;
    }));
  }

  login(email: string, password: string) {
    let oldUser = { email: email, password: password };
    const url = environment.baseUrl + '/login';
    return this.http.post<AuthResponseData>(url, JSON.stringify(oldUser), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(
      tap(this.setUserData.bind(this)
    ));
  }

  private setUserData(userData: AuthResponseData) {
    const awsUrl = environment.imageUrl;
    const remainingMilliseconds = userData.expires_in;
    const expirationTime = new Date(
      new Date().getTime() + (remainingMilliseconds * 1000)
    );
     
    const user = new User(
      userData.user_info.id,
      userData.user_info.firstname,
      userData.user_info.lastname,
      userData.user_info.email,
      userData.user_info.status,
      userData.user_info.country,
      userData.user_info.phone,
      awsUrl + userData.user_info.profile_pic,
      userData.user_info.flag,
      userData.access_token,
      expirationTime
    );
    
    this._user.next(user);
    
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(
      user.id,
      user.firstname,
      user.lastname,
      user.email,
      user.status,
      user.country,
      user.phone,
      user.profile_pic,
      user.flag,
      user.token,
      expirationTime.toISOString()
    );
  }

  private storeAuthData(
    userId: string,
    firstname: string,
    lastname: string,
    email: string,
    status: number,
    country: string,
    phone: string,
    profile_pic: string,
    flag: string,
    token: string,
    tokenExpirationDate: string
  ) {
    const data = JSON.stringify({
      userId: userId,
      firstname: firstname,
      lastname: lastname,
      email: email,
      status: status,
      country: country,
      phone: phone,
      profile_pic: profile_pic,
      flag: flag,
      token: token,
      tokenExpirationDate: tokenExpirationDate
    });

    Plugins.Storage.set({
      key: 'authData',
      value: data
    });
    
  }

  private autoLogout(duration: number) {
    if(this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  logout() {
    if(this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    Plugins.Storage.remove({ key: 'authData' });
    this.router.navigateByUrl('/login');
  }

  sendPasswordResetLink(email: string) {
    let user = { email: email };
    
    const url = environment.baseUrl + '/sendpasswordresetlink';
    return this.http.post<ResetData>(url, JSON.stringify(user), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(map(resData => {
      
      return resData;
    }));
  }

  changePassword(password: string, email: string, resetToken: string) {
    let user = { password: password, email: email, resetToken:resetToken };
    
    const url = environment.baseUrl + '/resetpassword';
    return this.http.post<any>(url, JSON.stringify(user), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(map(resData => {
      
      return resData;
    }));
  }

  updateProfile(
    firstname: string,
    lastname: string,
    theImage: [],
    phone: string,
    country: string
  ) {
    let profile = {
      firstname: firstname, 
      lastname: lastname, 
      theImage: theImage,
      phone: phone,
      country: country
    };

    const url = environment.baseUrl + '/editProfile';
    const awsUrl = environment.imageUrl;
    let oldToken: string;
    
    const expirationTime = new Date(
      new Date().getTime() + (60 * 1000)
    );
    return this.token.pipe(
      take(1),
      switchMap(token => {
        let newToken: string = token;
        oldToken = newToken;
        return this.http.post<any>(url, JSON.stringify(profile), {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          })
        })
        .pipe(map(resData => {
            
          const user = new User(
            resData.profile.id,
            resData.profile.firstname,
            resData.profile.lastname,
            resData.profile.email,
            resData.profile.status,
            resData.profile.country,
            resData.profile.phone,
            awsUrl + resData.profile.profile_pic,
            resData.profile.flag,
            oldToken,
            expirationTime
          );

          this._user.next(user);
        }));
      })
    );    
  }

  
  ngOnDestroy() {
    if(this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

}
