import { TransactionType } from './../../entities/transactionType.class';
import { User } from './../../entities/user.class';
import { TransactionFilterSearchResult } from './../../entities/trSearchResult.class';
import { TransactionSearchResult } from './../../pEntites/transactionSearchResult.class';
import { TransactionSearch } from './../../pEntites/transactionSearch.class';
import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { TransactionP } from './../../pEntites/transactionP.class';
import { BasicData } from './../../entities/basicData.class';
import { GrowlMessage } from './../../entities/growlMessage.class';
import { BackendMessage } from '../../entities/Msg.class'
import { HandleErrorMsg } from '../../shared/handleError.class'
import { SharedValues } from './../../services/shared-values.service';
import { FinancialMgmService } from 'app/services/financialMgm.service';


@Component({
  selector: 'app-transaction-mgm',
  templateUrl: './transaction-mgm.component.html',
  styleUrls: ['./transaction-mgm.component.css'],
  providers:[FinancialMgmService]
})
export class TransactionMgmComponent implements OnInit {
  activeLabel =this.shared.transactionLabel;
  hmsgs: GrowlMessage[] = [];
  loading = false;
  totalRecords: number;
  errorCntrler: HandleErrorMsg;
  basicData: BasicData;
  sortF: string = "";
  sortO: string = ""
  displayTransactionList = false;
  displayFilterDialog = false;
  displayTransactionView = false;

  transactionList:TransactionP[] = [];
  transactioSearch: TransactionSearch = new TransactionSearch();
  chipsFilterValues: string[] = [];
  chipsFilterMap: Map<string, string> = new Map<string, string>();
  dataTableLoading: boolean = false;
  defaultPageSize: number = 8;
  first: number = 0;
  currentPageIndex: number;
  transactionDataLoadedMap: Map<number, boolean> = new Map<number, boolean>();
  selectedFilter: TransactionSearch = null;
  filteredTransactionAmountRange: number[] = [];
  filteredRegisterStartDate:string = null;
  filteredRegisterStopDate:string = null;
  filteredPaymentMethodID:number = 0;
  filteredTrackingCode:string = null;
  filteredPaymentTypeID:TransactionType = null;
  filteredReferenceUserID:User = null;
  filteredFirstName:string = null;
  filteredLastName:string = null;
  loadingDialog = false;
  selectedTransactionP: TransactionP = null;

  constructor(private _router: Router,
    public shared: SharedValues,
    private cdRef: ChangeDetectorRef,
    public financialMgmService: FinancialMgmService) { }

  ngOnInit() {
    this.errorCntrler = new HandleErrorMsg(this._router);
    this.basicData = JSON.parse(localStorage.getItem('basicData'));
    this.sortF = "1";
    this.sortO = "1";
    this.initTransactionList();
  }
  paginate(event) {
    //event.first: Index of first record being displayed 
    //event.rows: Number of rows to display in new page 
    //event.page: Index of the new page 
    //event.pageCount: Total number of pages 
    this.currentPageIndex = event.first / event.rows + 1 // Index of the new page if event.page not defined.
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
      console.log(result);
      this.dataTableLoading = false;
      this.loading = false;
      let temp: TransactionSearchResult = <TransactionSearchResult>result;
      __transactionList = temp.transactionList;
      this.transactionList = __transactionList;
      this.totalRecords = temp.totalSize;
      this.showTransactionList();
    }, error => {
      this.loading = false;
      let obj: TransactionSearchResult = error.error;
      let err: BackendMessage = obj.error;
      this.parseError(error.status, err);
      this.dataTableLoading = false;
    });
  }
  loadRequestsLazy(event: LazyLoadEvent) {
    this.transactioSearch.firstRow = event.first;
    this.transactioSearch.totalSize = 0;
    this.transactioSearch.pageSize = this.defaultPageSize;
    let __transactionList = [...this.transactionList];
    this.dataTableLoading = true;
    this.financialMgmService.search(this.transactioSearch).subscribe(result => {
      let temp: TransactionSearchResult = <TransactionSearchResult>result;
      __transactionList = temp.transactionList;
      this.transactionList = __transactionList;
      this.dataTableLoading = false;
    }, error => {
      let obj: TransactionSearchResult = error.error;
      let err: BackendMessage = obj.error;
      this.parseError(error.status, err);
      this.dataTableLoading = false;
    });

  }
  showTransactionList() {
    this.displayTransactionList = true;
    this.transactionList.forEach(element => {
      let x:TransactionP = element;
    });
  }
  showFilterDialog(){
    this.displayFilterDialog = true;

  }
  onSearchFilterPanel(event) {
    try {
      this.displayFilterDialog = false;
      let data: TransactionFilterSearchResult = event;
      let __transactionList = [...this.transactionList];

      __transactionList = data.transactions;
      this.transactionList = __transactionList;
      this.transactionDataLoadedMap.clear();
      this.transactionList.forEach(element => {
        this.transactionDataLoadedMap.set(element.id, true);
      });
      this.totalRecords = data.totalSize;
      this.selectedFilter = data.transactionSearch;
      this.transactioSearch = this.selectedFilter;
      this.filteredFirstName = data.selectedFirstName;
      this.filteredLastName = data.selectedLastName;
      this.filteredPaymentMethodID = data.selectedPaymentMethod;
      this.filteredPaymentTypeID = data.selectedPaymentType;
      this.filteredReferenceUserID = data.selectedReferenceUser;
      this.filteredRegisterStartDate = data.selectedRegisterStartDate;
      this.filteredRegisterStopDate = data.selectedRegisterStopDate;      
      this.filteredTrackingCode = data.selectedTrackingCode;
      this.filteredTransactionAmountRange = data.selectedTransactionAmountRange;
      this.first = 0;

      this.displayFilterDialog = false;
      this.chipsFilterMap.clear();
      this.chipsFilterValues = [];
      if (this.selectedFilter.f_userFirstName) {
        let firstName: string = data.selectedFirstName;
        this.chipsFilterMap.set(this.shared.firstNameLabel + " : " + firstName, "f_userFirstName");
        this.chipsFilterValues.push(this.shared.firstNameLabel + " : " + firstName);
      }
      if (this.selectedFilter.f_userLastName) {
        let lastName: string = data.selectedLastName;
        this.chipsFilterMap.set(this.shared.lastNameLabel + " : " + lastName, "f_userLastName");
        this.chipsFilterValues.push(this.shared.lastNameLabel + " : " + lastName);
      }
      if (this.selectedFilter.f_amount) {
        let amount: string = data.selectedTransactionAmountRange[0] + "-" + data.selectedTransactionAmountRange[1];
        this.chipsFilterMap.set(this.shared.transactionAmountLabel + " : " + amount, "f_amount");
        this.chipsFilterValues.push(this.shared.transactionAmountLabel + " : " + amount);
      }
      if (this.selectedFilter.f_trackingCode) {
        let trackingCode: string = data.selectedTrackingCode;
        this.chipsFilterMap.set(this.shared.trackingCodeLabel + " : " + trackingCode, "f_trackingCode");
        this.chipsFilterValues.push(this.shared.trackingCodeLabel + " : " + trackingCode);
      }
      if (this.selectedFilter.f_registerTime) {
        let registerTime: string = data.selectedRegisterStartDate + "--------------------" + data.selectedRegisterStopDate;
        this.chipsFilterMap.set(this.shared.registerPeriodTimeLabel + " : " + registerTime, "f_registerTime");
        this.chipsFilterValues.push(this.shared.registerPeriodTimeLabel + " : " + registerTime);
      }
      if (this.selectedFilter.f_cash) {
        let paymentMethodID: number = data.selectedPaymentMethod;
        let paymentMStr = "";
        if(paymentMethodID == 1)
            paymentMStr = paymentMStr = this.shared.cacheLabel;
        else  if(paymentMethodID == 2)
            paymentMStr = paymentMStr = this.shared.withCreditLabel;
        this.chipsFilterMap.set(this.shared.paymentMethodLabel + " : " + paymentMStr, "f_cash");
        this.chipsFilterValues.push(this.shared.paymentMethodLabel + " : " + paymentMStr);
      }
      if (this.selectedFilter.f_typeId) {
        let paymentType: string = data.selectedPaymentType.name;
        this.chipsFilterMap.set(this.shared.paymentTypeLabel + " : " + paymentType, "f_typeId");
        this.chipsFilterValues.push(this.shared.paymentTypeLabel + " : " + paymentType);
      }
      if (this.selectedFilter.f_refUserId) {
        let refUserId: string = data.selectedReferenceUser.userName;
        this.chipsFilterMap.set(this.shared.userNameLabel + " : " + refUserId, "f_refUserId");
        this.chipsFilterValues.push(this.shared.userNameLabel + " : " + refUserId);
      }


    }
    catch (e) {
      console.log(e);
    }

  }
  onRemoveChip(event) {
    let selectedChipFilter: string = this.chipsFilterValues[event];
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_userFirstName') {
      this.selectedFilter.f_userFirstName = false;
      this.selectedFilter.userFirstName = null;
      this.filteredFirstName= null;
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_userLastName') {
      this.selectedFilter.f_userLastName = false;
      this.selectedFilter.userLastName = null;
      this.filteredLastName= null;
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_amount') {
      this.selectedFilter.f_amount = false;
      this.filteredTransactionAmountRange = [];
    }
   
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_trackingCode') {
      this.selectedFilter.f_trackingCode = false;
      this.filteredTrackingCode = "";
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_registerTime') {
      this.selectedFilter.f_registerTime = false;
      this.filteredRegisterStartDate = null;
      this.filteredRegisterStopDate = null;
    }

    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_cash') {
      this.selectedFilter.f_cash = false;
      this.filteredPaymentMethodID = 0;
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_refUserId') {
      this.selectedFilter.f_refUserId = false;
      this.filteredReferenceUserID = null;
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_typeId') {
      this.selectedFilter.f_typeId = false;
      this.filteredPaymentTypeID = null;
    }

   

    this.dataTableLoading = true;
    this.transactionDataLoadedMap.clear();
    this.transactionList = [];
    let __transactions = [...this.transactionList];
    this.transactioSearch = this.selectedFilter;
    this.first = 0;

    this.financialMgmService.search(this.selectedFilter).subscribe(response => {
      this.transactionList = [];
      let res: TransactionSearchResult = <TransactionSearchResult>response;
      let transactions = res.transactionList;
      transactions.forEach(element => {
        __transactions.push(element);
        this.transactionDataLoadedMap.set(element.id, true);
      });
      this.totalRecords = res.totalSize;
      this.displayFilterDialog = false;
      this.chipsFilterValues.splice(event, 1);
      this.chipsFilterMap.delete(selectedChipFilter);
      this.transactionList = __transactions;
      this.dataTableLoading = false;
    }, error => {
      let obj: TransactionSearchResult = error.error;
      let err: BackendMessage = obj.error;
      this.parseError(error.status, err);
      this.dataTableLoading = false;
    });
  }
  onErrorFilterPanel(event) {
    this.hmsgs.push({ severity: 'error', summary: '', detail: event });
  }
 
  showTransactiontDetail(transaction:TransactionP) {
    let id = transaction.id;
    this.loadingDialog = true;
    this.displayTransactionView = true;

    this.financialMgmService.lookupByIdP(id).subscribe(result => {
      this.selectedTransactionP = <TransactionP>result;
      this.loadingDialog = false;
    }, error => {
      console.log(error);
      this.displayTransactionView = false;
      this.loadingDialog = false;

      let obj: TransactionP = error.error;
      let err: BackendMessage = obj.error;
      this.parseError(error.status, err);
    });
  }
  parseError(status: any, err: any) {
    this.errorCntrler.gMessage = [];
    this.hmsgs = [];
    let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(status, err);
    let errorMessages = this.errorCntrler.gMessage;
    errorMessages.forEach(element => {
      this.hmsgs.push(element);
    });
  }
}