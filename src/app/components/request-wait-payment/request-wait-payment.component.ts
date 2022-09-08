import { RequestStateEnum } from './../../enums/requestState.enum';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-request-wait-payment',
  templateUrl: './request-wait-payment.component.html',
  styleUrls: ['./request-wait-payment.component.css'],
  
})
export class RequestWait4PaymentComponent implements OnInit {
  requestStateTypeID:number;
  constructor() { }

  ngOnInit() {
    this.requestStateTypeID = RequestStateEnum.waitToPayment;
  }

}
