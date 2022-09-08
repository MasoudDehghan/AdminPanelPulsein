import { SharedDataService } from 'app/services/sharedData.service';
import { TransactionV } from './../../entities/transactionV.class';
import { Component, OnInit, Input } from '@angular/core';
import { SharedValues } from 'app/services/shared-values.service';
import { PrintService } from 'app/services/print.service';

@Component({
  selector: 'app-worker-payment-print-view',
  templateUrl: './worker-payment-print-view.component.html',
  styleUrls: ['./worker-payment-print-view.component.css']
})
export class WorkerPaymentPrintViewComponent implements OnInit {
  transactionListHeader: string;
  selectedTransactionList: TransactionV[] = [];

  constructor(public shared:SharedValues,
    private dataService: SharedDataService,
    private printService:PrintService) { }

  ngOnInit() {
    this.selectedTransactionList = this.dataService.selectedTransactionList;
    this.transactionListHeader = this.dataService.transactionListHeader;
    this.printService.onDataReady();

  }

}
