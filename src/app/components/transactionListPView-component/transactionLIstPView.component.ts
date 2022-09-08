import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransactionP } from 'app/pEntites/transactionP.class';
import { TransactionSearch } from 'app/pEntites/transactionSearch.class';
import { TransactionSearchResult } from 'app/pEntites/transactionSearchResult.class';
import { SharedValues } from 'app/services/shared-values.service';
import { SharedDataService } from 'app/services/sharedData.service';
import { FinancialMgmService } from './../../services/financialMgm.service';
import { PrintService } from './../../services/print.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './transactionLIstPView.component.html',
  styleUrls: ['./transactionLIstPView.component.css'],
  providers:[FinancialMgmService]
})
export class TransactionListPrintViewComponent implements OnInit {
  invoiceIds: string[];
  invoiceDetails: Promise<any>[];
  transactionListHeader:string;
  selectedTransactionList:TransactionP[] = [];
  selectedTransactionSearch: TransactionSearch = new TransactionSearch();
  selectedTransactionTotalRecords:number = 0;
  selecedWorkerCredit:number = 0;
  displayTransactionView:boolean = false;
  constructor(route: ActivatedRoute,
              public shared: SharedValues,
              public dataService:SharedDataService,
              public financialMgmService: FinancialMgmService,
              private printService: PrintService) {

  }

  ngOnInit() {
    this.selectedTransactionTotalRecords = this.dataService.selectedTransactionTotalRecords;
    this.printTransactiontDetail();
  }


  printTransactiontDetail() {
    let worker = this.dataService.worker;
    let id = worker.id;
    this.displayTransactionView = true;
    this.selectedTransactionSearch = new TransactionSearch();
    this.selectedTransactionSearch.f_userId = true;
    this.selectedTransactionSearch.userId= worker.user.id;
    this.selectedTransactionSearch.pageSize = this.selectedTransactionTotalRecords;
    this.selecedWorkerCredit = worker.user.financialInfo.credit;
    this.transactionListHeader = this.shared.showTransactionList+" "+ worker.user.firstName+" "+ worker.user.lastName;
    this.financialMgmService.search(this.selectedTransactionSearch).subscribe(result => {
      this.selectedTransactionList = [];
      let res: TransactionSearchResult = <TransactionSearchResult>result;
      let transactions = res.transactionList;
      this.selectedTransactionList = transactions;
      this.selectedTransactionTotalRecords = res.totalSize;
      this.printService.onDataReady();
    }, error => {
      console.log(error);
      this.displayTransactionView = false;
    });
  }

}
