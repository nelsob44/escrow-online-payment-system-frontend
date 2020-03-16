import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { take, map, tap, delay, switchMap, filter } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Item } from './models/item.model';
import {Payment} from './models/payment.model';
import { User } from './auth/user.model';

@Injectable({
  providedIn: 'root'
})
export class BridgeService {
  private _items = new BehaviorSubject<Item[]>([]);

  get items() {
    return this._items.asObservable();
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
          console.log(data);
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
        console.log(data);
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
    console.log(uploadData);
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
                  resData.data[key].intent_id,
                  resData.data[key].payment_option,
                  resData.data[key].real_amount,                  
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
