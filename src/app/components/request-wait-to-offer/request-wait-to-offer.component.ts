import { RequestStateEnum } from './../../enums/requestState.enum';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-request-wait-to-offer',
  templateUrl: './request-wait-to-offer.component.html',
  styleUrls: ['./request-wait-to-offer.component.css'],
  
})
export class RequestWaitToOfferComponent implements OnInit {
  requestStateTypeID:number;
  constructor() { }

  ngOnInit() {
    this.requestStateTypeID = RequestStateEnum.waitToOffer;
  }

}
