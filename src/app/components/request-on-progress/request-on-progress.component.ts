import { RequestStateEnum } from './../../enums/requestState.enum';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-request-on-progress',
  templateUrl: './request-on-progress.component.html',
  styleUrls: ['./request-on-progress.component.css'],
  
})
export class RequestOnProgressComponent implements OnInit {
  requestStateTypeID:number;
  constructor() { }

  ngOnInit() {
    this.requestStateTypeID = RequestStateEnum.ongoing;
  }

}
