import { RequestStateEnum } from '../../enums/requestState.enum';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-request-all',
  templateUrl: './request-all.component.html',
  styleUrls: ['./request-all.component.css'],
  
})
export class RequestAllComponent implements OnInit {
  requestStateTypeID:number;
  constructor() { }

  ngOnInit() {
    this.requestStateTypeID = RequestStateEnum.all;
  }

}
