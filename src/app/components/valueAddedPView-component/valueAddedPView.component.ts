import { ValueAddedAggregatedInfo } from './../../entities/valueAddedAggregatedInfo.class';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ValueAddedInfo } from 'app/entities/valueAddedInfo.class';
import { SharedValues } from 'app/services/shared-values.service';
import { SharedDataService } from 'app/services/sharedData.service';
import { PrintService } from './../../services/print.service';

@Component({
  selector: 'app-valueAddedPView',
  templateUrl: './valueAddedPView.component.html',
  styleUrls: ['./valueAddedPView.component.css']
})
export class ValueAddedPrintViewComponent implements OnInit {
  selectedData:ValueAddedInfo;
  selectedAggregatedValueAddedInfo : ValueAddedAggregatedInfo;
  accNumberRegisterTimeS:string;
  accountantNumber:string;
  constructor(route: ActivatedRoute,
              public shared: SharedValues,
              public dataService:SharedDataService,
              private printService: PrintService) {

  }

  ngOnInit() {
    this.selectedData = this.dataService.valueAddedInfo;
    this.selectedAggregatedValueAddedInfo = this.dataService.aggregatedValueAddedInfo;
    if(this.selectedData){
      this.accNumberRegisterTimeS = this.selectedData.accNumberRegisterTimeS.substring(0,10);
      this.accountantNumber = this.selectedData.accountantNumber;
    }
    else if(this.selectedAggregatedValueAddedInfo){
      this.accNumberRegisterTimeS = this.selectedAggregatedValueAddedInfo.accNumberRegisterTimeS.substring(0,10);
      this.accountantNumber = this.selectedAggregatedValueAddedInfo.accountantNumber;
    }
    this.printService.onDataReady();
  }

}
