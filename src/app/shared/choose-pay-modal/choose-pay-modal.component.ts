import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-choose-pay-modal',
  templateUrl: './choose-pay-modal.component.html',
  styleUrls: ['./choose-pay-modal.component.scss'],
})
export class ChoosePayModalComponent implements OnInit {
  @ViewChild('choosepaymentmodal', { static: false }) choosePaymentModalElementRef: ElementRef;
  @Input() closeButtonText = 'Cancel';
  @Input() title = 'Choose Payment Option';
  
  constructor() { }

  ngOnInit() {}

  onChooseStripe(itemName: string,
  itemPrice: number,
  currency: string,
  buyerName: string,
  connectionChannel: string,
  itemDescription: string,
  itemSerialNo: string,
  itemModelNo: string,
  imeiFirst: string,
  imeiLast: string
  ) {

  }

  onChoosePaypal(itemName: string,
  itemPrice: number,
  currency: string,
  buyerName: string,
  connectionChannel: string,
  itemDescription: string,
  itemSerialNo: string,
  itemModelNo: string,
  imeiFirst: string,
  imeiLast: string) {

  }

}
