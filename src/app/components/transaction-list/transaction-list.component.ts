import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BackendMessage } from 'app/entities/Msg.class';
import { FinancialMgmService } from 'app/services/financialMgm.service';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { TransactionSummary } from '../../entities/transactionSummary.class';
import { SharedValues } from '../../services/shared-values.service';
import { Constant } from '../../shared/constants.class';
import { TransactionP } from './../../pEntites/transactionP.class';
import { TransactionSearch } from './../../pEntites/transactionSearch.class';
import { TransactionSearchResult } from './../../pEntites/transactionSearchResult.class';

@Component({
  moduleId: module.id,  
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
  providers:[FinancialMgmService]
  
})
export class TransactionListComponent implements OnInit {
  @Input() transactionListHeader:string;
  @Input() transactionList: TransactionP[] = [];
  @Input() transactioSearch: TransactionSearch = null;
  @Input() totalRecords = 0;
  @Input() balance:number = 0;
  @Input() isWorker:boolean = false;
  @Input() loading: boolean;
  @Input() pageSize = Constant.lazyLoadingPageSize;
  @Input() showDetail = true;
  @Output() showDiscountEvent = new EventEmitter<number>();
  first:number = 0;
  sortF: string = "";
  sortO: string = ""
  dataTableLoading:boolean = false;
  summary:TransactionSummary;

  constructor(private _router: Router,
    public shared: SharedValues,
    private cdRef: ChangeDetectorRef,
    public financialMgmService: FinancialMgmService) { }
  ngOnInit() {
  }
  
  ngAfterViewInit() {
    this.cdRef.detectChanges();

  }
  changeSort(event) {
    this.sortF = event.field;
    this.sortO = event.order;
    this.transactioSearch.sortById = Number.parseInt(event.field);
    if (event.order == -1)
      this.transactioSearch.sortOrderId = 2;
    else
      this.transactioSearch.sortOrderId = 1;
    this.initTransactionList();

  }
  initTransactionList(){
    let __transactionList = [...this.transactionList];
    this.loading = true;
    this.dataTableLoading = true;
    this.financialMgmService.search(this.transactioSearch).subscribe(result => {
      this.dataTableLoading = false;
      this.loading = false;
      let temp: TransactionSearchResult = <TransactionSearchResult>result;
      __transactionList = temp.transactionList;
      this.transactionList = __transactionList;
      this.totalRecords = temp.totalSize;
      this.summary = temp.summary;

    }, error => {
      this.loading = false;
      let obj: TransactionSearchResult = error.error;
      let err: BackendMessage = obj.error;
      this.dataTableLoading = false;
    });
  }
  loadRequestsLazy(event: LazyLoadEvent) {
    this.transactioSearch.firstRow = event.first;
    this.transactioSearch.totalSize = 0;
    this.transactioSearch.pageSize = this.pageSize;
    let __transactionList = [...this.transactionList];
    this.dataTableLoading = true;
    this.financialMgmService.search(this.transactioSearch).subscribe(result => {
      let temp: TransactionSearchResult = <TransactionSearchResult>result;
      __transactionList = temp.transactionList;
      this.transactionList = __transactionList;
      this.dataTableLoading = false;
      this.summary = temp.summary;
    }, error => {
      let obj: TransactionSearchResult = error.error;
      let err: BackendMessage = obj.error;
      this.dataTableLoading = false;
    });

  }
  showDiscount(discountID:number){
    this.showDiscountEvent.emit(discountID);
  }
  
}

