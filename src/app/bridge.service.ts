import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { take, map, tap, delay, switchMap, filter } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Item } from './models/item.model';
import {Payment} from './models/payment.model';
import { User } from './auth/user.model';
import { Verify } from './models/verify.model';
import { isArray } from 'util';

@Injectable({
  providedIn: 'root'
})
export class BridgeService {
  private _items = new BehaviorSubject<Item[]>([]);
  private _verified = new BehaviorSubject<boolean>(false);

  get items() {
    return this._items.asObservable();
  }

  get isVerified() {
    return this._verified.asObservable().pipe(
      map(verified => {        
        if(verified) {
          return true;
        } else {
          return false;
        }
      })
    );
  }
  
  constructor(private http: HttpClient, private authService: AuthService) { }

  getItem(id: string) {    
    return this.items.pipe(
      take(1),
      map(items => {
        return { ...items.find(e => e.id === id)};
      })
    );     
  }
  
  fetchitems(page: number = null) {
    const url = environment.baseUrl + '/my-items?page=' + page;
    const awsUrl = environment.imageUrl;   
    const uploadData = new FormData();
    
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<any>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }), 
        map(data => {    
          
          const items = [];
          for (const key in data.data.data) {
            if(data.data.data.hasOwnProperty(key)) {
              items.push(
                new Item(
                  data.data.data[key].id,
                  data.data.data[key].item_name,
                  data.data.data[key].amount,
                  data.data.data[key].seller_currency,
                  awsUrl + data.data.data[key].cover_photo,
                  data.data.data[key].seller_id,
                  data.data.data[key].seller_email,
                  data.data.data[key].buyer_name,
                  data.data.data[key].connection_channel,                  
                  data.data.data[key].description,
                  data.data.data[key].serial_no,                  
                  data.data.data[key].model_no,
                  data.data.data[key].imei_first,
                  data.data.data[key].imei_last,
                  new Date(data.data.data[key].created_at)
                )
              );
            }
          }   
          
          return items;
        }),
        tap(items => {
          this._items.next(items);
        })     
    );
  }

  fetchitem(id: string) { 

    const url = environment.baseUrl + '/my-item-detail/' + id;
    const awsUrl = environment.imageUrl;   
    const uploadData = new FormData();
    
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<any>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }),
      map(itemData => {      
          
          return itemData.data['itemImages'];
    }));       
  }

  createPaypalOrder(data: any) { 

    const url = environment.baseUrl + '/create-paypal-transaction';
       
    let uploadData = data;    
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        
        return this.http.post<any>(url, JSON.stringify(uploadData), {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          })
        })
        .pipe(tap(resData => {
          
          return resData;
        }));
      })
    );         
  }

  deleteItem(id: string) { 

    const url = environment.baseUrl + '/delete-item';
    const awsUrl = environment.imageUrl;   
    const uploadData = new FormData();
    uploadData.append('id', id);
    
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<any>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }),
      map(data => {    
        
        const items = [];
          for (const key in data.data.data) {
            if(data.data.data.hasOwnProperty(key)) {
              items.push(
                new Item(
                  data.data.data[key].id,
                  data.data.data[key].item_name,
                  data.data.data[key].amount,
                  data.data.data[key].seller_currency,
                  awsUrl + data.data.data[key].cover_photo,
                  data.data.data[key].seller_id,
                  data.data.data[key].seller_email,
                  data.data.data[key].buyer_name,
                  data.data.data[key].connection_channel,                  
                  data.data.data[key].description,
                  data.data.data[key].serial_no,                  
                  data.data.data[key].model_no,
                  data.data.data[key].imei_first,
                  data.data.data[key].imei_last,
                  new Date(data.data.data[key].created_at)
                )
              );
            }
          }          
          this._items.next(items);
          return items;
    }));       
  }

  clearCache() {
    const url = environment.baseUrl + '/admin/clear-cache';
       
    const uploadData = new FormData();
        
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<any>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }),
      map(data => {   
        return data;         
      }
    ));
  }

  resendEmailVerification(email: string) {
    
    const url = environment.baseUrl + '/again';
       
    const uploadData = new FormData();
    uploadData.append('email', email);

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<any>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }),
      map(data => {      
           
          return data.message;
    }));       
  }

  checkEmailVerification() {
    
    const url = environment.baseUrl + '/check-emailverification';
       
    const uploadData = new FormData();
    
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<any>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }),
      map(data => {      
           
          return data.message;
    }));       
  }

  searchitem(id: string) { 

    const url = environment.baseUrl + '/my-item-search';
    const awsUrl = environment.imageUrl;   
    const uploadData = new FormData();
    uploadData.append('id', id);
    
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<any>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }),
      map(data => {   
          
          if(data.data === "The search was not found") {
            return data.data;
          } else {
            return new Item(
              data.data.id,
              data.data.item_name,
              data.data.amount,
              data.data.seller_currency,
              awsUrl + data.data.cover_photo,
              data.data.seller_id,
              data.data.seller_email,
              data.data.buyer_name,
              data.data.connection_channel,                  
              data.data.description,
              data.data.serial_no,                  
              data.data.model_no,
              data.data.imei_first,
              data.data.imei_last,
              new Date(data.data.created_at)
            );
          }
           
      }
    ));       
  }


  uploadImage(images: any[]) {

    const URL = environment.baseUrl + '/add-image';
    const uploadData = new FormData();
    let filesLength = images.length;
    images.forEach(img => {
      uploadData.append('files[]', img);
    });
    
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        
        return this.http.post<any>(URL, uploadData, 
        {headers: {Authorization: 'Bearer ' + token}}
        ).pipe(
          map(data => {   
            
            return data;
          })
        );
      })
    );     
  }

  addItem(
    itemName: string,
    itemPrice: string,
    currency: string,
    theImages: [],
    buyerName: string,
    connectionChannel: string,
    itemDescription: string,
    itemSerialNo: string,
    itemModelNo: string,
    imeiFirst: string,
    imeiLast: string
  ) {
    let uploadData = {
      itemName: itemName, 
      itemPrice: itemPrice, 
      currency: currency,
      theImages: theImages, 
      buyerName: buyerName, 
      connectionChannel: connectionChannel,
      itemDescription: itemDescription,
      itemSerialNo: itemSerialNo,
      itemModelNo: itemModelNo,
      imeiFirst: imeiFirst,
      imeiLast: imeiLast
    };
    const url = environment.baseUrl + '/add-item';
   
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        
        return this.http.post<any>(url, JSON.stringify(uploadData), {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          })
        })
        .pipe(tap(resData => {
          
          return resData;
        }));
      })
    );    
  }

  addPaymentIntentStripe(
    itemId: string,
    itemName: string,
    itemPrice: string,
    currency: string,
    
    buyerName: string,
    connectionChannel: string,
    itemDescription: string,
    itemSerialNo: string,
    itemModelNo: string,
    imeiFirst: string,
    imeiLast: string
  ) {
    let uploadData = {
      itemId: itemId,
      itemName: itemName, 
      itemPrice: itemPrice, 
      currency: currency,
      
      buyerName: buyerName, 
      connectionChannel: connectionChannel,
      itemDescription: itemDescription,
      itemSerialNo: itemSerialNo,
      itemModelNo: itemModelNo,
      imeiFirst: imeiFirst,
      imeiLast: imeiLast
    };
    
    const url = environment.baseUrl + '/payment-intent';
   
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        
        return this.http.post<any>(url, JSON.stringify(uploadData), {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          })
        })
        .pipe(tap(resData => {
          
          return resData;
        }));
      })
    );    
  }

  addPaypalApprovedOrder(
    paypalOrderId: string,
    itemId: string,
    itemName: string,
    amount: string,
    description: string,
    currency: string,
    buyer: string,
    commission: string,
    itemPrice: string,
    buyerEmail: string,
    realAmount: string,
    seller_id: string,
    seller_email: string,
    connectionChannel: string,
    itemSerialNo?: string,
    itemModelNo?: string,
    imeiFirst?: string,
    imeiLast?: string
  ) {
    let uploadData = {
      paypalOrderId: paypalOrderId,
      itemId: itemId,
      itemName: itemName, 
      amount: amount,
      itemDescription: description,
      currency: currency,
      buyer: buyer,
      commission: commission,
      itemPrice: itemPrice, 
      buyerEmail: buyerEmail,
      realAmount: realAmount,
      seller_id: seller_id, 
      seller_email: seller_email,
      connectionChannel: connectionChannel,      
      itemSerialNo: itemSerialNo,
      itemModelNo: itemModelNo,
      imeiFirst: imeiFirst,
      imeiLast: imeiLast
    };
    
    const url = environment.baseUrl + '/create-paypal-payment';
   
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        
        return this.http.post<any>(url, JSON.stringify(uploadData), {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          })
        })
        .pipe(tap(resData => {
          
          return resData;
        }));
      })
    );    
  }

  fetchverifysecret(id: string) {
    const url = environment.baseUrl + '/verify';
    const uploadData = new FormData();
    uploadData.append('id', id);
    
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<any>(url, uploadData,
          {headers: {Authorization: 'Bearer ' + token}}
        )
      }),
      map(data => {      
         
          return new Verify(
            data.secrets[0],
            data.secrets[1]
          );          
    }));
  }

  verifySecretAnswer(secretCharactersChosen: any[]) {
    const URL = environment.baseUrl + '/verify-answer';
    const uploadData = new FormData();
    
    secretCharactersChosen.forEach(ans => {
      uploadData.append('secrets[]', ans);
    });
    
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        
        return this.http.post<any>(URL, uploadData, 
        {headers: {Authorization: 'Bearer ' + token}}
        ).pipe(
          map(data => {  
            if(isArray(data.secrets) && data.secrets.length == 3) {
              this._verified.next(true);
            } else {
              this._verified.next(false);
            }
            
            return data.secrets;
          })
        );
      })
    );  
  }

  sendSellerPayment(id: number) {
    const URL = environment.baseUrl + '/send-sellerpayment';        
    let uploadData = {
      id: id
    };    

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        
        return this.http.post<any>(URL, JSON.stringify(uploadData), {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          })
        })
        .pipe(tap(resData => {
          
          return resData;
        }));
      })
    );  
  }

  searchpayment(paymentId: string) {
    const URL = environment.baseUrl + '/search-payment';        
    let uploadData = {
      paymentId: paymentId
    };    

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        
        return this.http.post<any>(URL, JSON.stringify(uploadData), {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          })
        })
        .pipe(
          map(resData => {
          
            return new Payment(
                  resData.payment.id,                  
                  resData.payment.hash_id,
                  resData.payment.payment_option,
                  resData.payment.amount_paid,                  
                  resData.payment.item_price,
                  resData.payment.seller_email,
                  resData.payment.buyer_name,
                  resData.payment.buyer_email,                  
                  resData.payment.item_description,
                  new Date(resData.payment.created_at),                  
                  resData.payment.payment_status,
                  resData.payment.currency,
                  resData.payment.correct_payment                  
              );               
        }));
      })
    );  
  }

  searchpaymentAdmin(paymentId: string) {
    const URL = environment.baseUrl + '/search-paymentadmin';        
    let uploadData = {
      paymentId: paymentId
    };    

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        
        return this.http.post<any>(URL, JSON.stringify(uploadData), {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          })
        })
        .pipe(
          map(resData => {
          
            return new Payment(
                  resData.payment.id,                  
                  resData.payment.hash_id,
                  resData.payment.payment_option,
                  resData.payment.amount_paid,                  
                  resData.payment.item_price,
                  resData.payment.seller_email,
                  resData.payment.buyer_name,
                  resData.payment.buyer_email,                  
                  resData.payment.item_description,
                  new Date(resData.payment.created_at),                  
                  resData.payment.payment_status,
                  resData.payment.currency,
                  resData.payment.correct_payment                  
              );               
        }));
      })
    );  
  }

  completePaypalOrder(id: string) {
    const URL = environment.baseUrl + '/complete-paypalorder';        
    let uploadData = {
      id: id
    };    

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        
        return this.http.post<any>(URL, JSON.stringify(uploadData), {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          })
        })
        .pipe(tap(resData => {
          
          return resData.message;
        }));
      })
    );  
  }

  fetchpayments(email: string, page: number = null) {    
    const url = environment.baseUrl + '/payments?page=' + page;       
    const uploadData = new FormData();
    uploadData.append('email', email);
    
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        
        return this.http.post<any>(url, uploadData, 
          {headers: {Authorization: 'Bearer ' + token}}
        ).pipe(map(resData => {
           
            const payments = [];
          for (const key in resData.data) {
            if(resData.data.hasOwnProperty(key)) {
              payments.push(
                new Payment(
                  resData.data[key].id,                  
                  resData.data[key].hash_id,
                  resData.data[key].payment_option,
                  resData.data[key].amount_paid,                  
                  resData.data[key].item_price,
                  resData.data[key].seller_email,
                  resData.data[key].buyer_name,
                  resData.data[key].buyer_email,                  
                  resData.data[key].item_description,
                  new Date(resData.data[key].created_at),                  
                  resData.data[key].payment_status,
                  resData.data[key].currency,
                  resData.data[key].correct_payment                  
                )
              );
            }
          }
          
          return payments;
        }));
      })
    );      
  }

  storePaymentIntent( 
    itemId: string,   
    buyer: string, 
    buyerEmail: string, 
    itemPrice: number, 
    intent_id: string, 
    currency: string, 
    realAmount: number, 
    description: string,
    sellerId: number,
    sellerEmail: string
    ) {
    let uploadData = {
      itemId: itemId,
      intentId: intent_id, 
      buyer: buyer,
      realAmount: realAmount, 
      currency: currency,      
      buyerEmail: buyerEmail, 
      itemPrice: itemPrice,     
      itemDescription: description,
      sellerId: sellerId,
      sellerEmail: sellerEmail     
    };
    
    const url = environment.baseUrl + '/store-intent';
   
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        
        return this.http.post<any>(url, JSON.stringify(uploadData), {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          })
        })
        .pipe(tap(resData => {
          
          return resData;
        }));
      })
    );    
  }
}
