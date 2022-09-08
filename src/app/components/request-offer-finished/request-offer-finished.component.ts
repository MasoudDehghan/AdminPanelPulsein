import { RequestStateEnum } from './../../enums/requestState.enum';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-request-offer-finished',
  templateUrl: './request-offer-finished.component.html',
  styleUrls: ['./request-offer-finished.component.css'],
  
})
export class RequestOfferFinishedComponent implements OnInit {
  requestStateTypeID:number;
  constructor() { }

  ngOnInit() {
    this.requestStateTypeID = RequestStateEnum.offerTimeFinished;
  }

}
