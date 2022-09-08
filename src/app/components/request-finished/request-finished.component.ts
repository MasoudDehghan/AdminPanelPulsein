import { RequestStateEnum } from './../../enums/requestState.enum';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-request-finished',
  templateUrl: './request-finished.component.html',
  styleUrls: ['./request-finished.component.css'],
  
})
export class RequestFinishedComponent implements OnInit {
  requestStateTypeList:number[];
  constructor() { }

  ngOnInit() {
    this.requestStateTypeList = [RequestStateEnum.canceled,RequestStateEnum.canceledByWorker,
      RequestStateEnum.expired,RequestStateEnum.finished];
  }

}
