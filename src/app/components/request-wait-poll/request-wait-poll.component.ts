import { RequestStateEnum } from './../../enums/requestState.enum';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-request-wait-poll',
  templateUrl: './request-wait-poll.component.html',
  styleUrls: ['./request-wait-poll.component.css'],
  
})
export class RequestWait4PollComponent implements OnInit {
  requestStateTypeID:number;
  constructor() { }

  ngOnInit() {
    this.requestStateTypeID = RequestStateEnum.waitToPoll;
  }

}
