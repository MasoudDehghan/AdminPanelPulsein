import { SharedDataService } from './../../services/sharedData.service';
import { SharedValues } from './../../services/shared-values.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-print-layout',
  templateUrl: './print-layout.component.html',
  styleUrls: ['./print-layout.component.css']
})
export class PrintLayoutComponent implements OnInit {
  header:string;
  constructor(public shared:SharedValues,public data:SharedDataService) { }

  ngOnInit() {
    this.header = this.shared.projectTitle;
    
    if(this.data.transactionListHeader)
      this.header = this.data.transactionListHeader;
    
  }

}
