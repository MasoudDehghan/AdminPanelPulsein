import { RegisterStateEnum } from 'app/enums/registerState.enum';
import { CreditSearchEnum } from './../../enums/creditSearch.enum';
import { WFinancialFilterSearchResult } from './../../pEntites/lastCreditSearchResultFilter.class';
import { TransactionP } from 'app/pEntites/transactionP.class';
import { TransactionSearchResult } from './../../pEntites/transactionSearchResult.class';
import { TransactionSearch } from './../../pEntites/transactionSearch.class';
import { LastCreditSearchResult } from './../../pEntites/lastCreditSearchResult.class';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { BasicData } from './../../entities/basicData.class';
import { GrowlMessage } from './../../entities/growlMessage.class';
import { BackendMessage } from '../../entities/Msg.class'
import { HandleErrorMsg } from '../../shared/handleError.class'
import { SharedValues } from './../../services/shared-values.service';
import { FinancialMgmService } from 'app/services/financialMgm.service';
import { LastCreditSearch } from 'app/pEntites/lastCreditSearch.class';
import { WorkerP } from 'app/pEntites/workP.class';
import { Constant } from '../../shared/constants.class';
import { SharedDataService } from 'app/services/sharedData.service';
import { PrintService } from 'app/services/print.service';
import { SortOrder } from 'app/enums/sortOrder.enum';


@Component({
  selector: 'app-wfinancial-mgm',
  templateUrl: './wfinancial-mgm.component.html',
  styleUrls: ['./wfinancial-mgm.component.css'],
  providers: [FinancialMgmService]
})
export class WFinancialMgmComponent implements OnInit {
  activeLabel = this.shared.menuItem6SubItem2Label;
  hmsgs: GrowlMessage[] = [];
  loading = false;
  totalRecords: number;
  errorCntrler: HandleErrorMsg;
  basicData: BasicData;
  sortF: string = "";
  sortO: string = ""
  displayWorkerList = false;
  displayFilterDialog = false;
  displayTransactionView = false;
  displayRegisterDialog = false;

  workerList: WorkerP[] = [];
  selectedTransactionList: TransactionP[] = [];
  selectedTransactionSearch: TransactionSearch = new TransactionSearch();
  selectedTransactionTotalRecords: number = 0;
  transactionListHeader: string = "";
  creditSearch: LastCreditSearch = new LastCreditSearch();
  chipsFilterValues: string[] = [];
  chipsFilterMap: Map<string, string> = new Map<string, string>();
  dataTableLoading: boolean = false;
  defaultPageSize: number = 10;
  first: number = 0;
  currentPageIndex: number;
  workerDataLoadedMap: Map<number, boolean> = new Map<number, boolean>();
  selectedFilter: LastCreditSearch = null;
  filteredTransactionAmountStart: number = 0;
  filteredTransactionAmountStop: number = 0;
  filteredUpdateStartDate: string = null;
  filteredUpdateStopDate: string = null;
  filteredFirstName: string = null;
  filteredLastName: string = null;
  filteredCode: string = null;
  filteredRegisterState: number = -1;
  loadingDialog = false;
  selectedWorkerP: WorkerP = null;
  selecedWorkerCredit: number = 0;
  displayWorkerView: boolean = false;
  selectedWorkerFullName: string = "";
  displayImageDialog = false;
  selectedImagePath: string;

  selectedWorkerID: number;
  constructor(private _router: Router,
    public shared: SharedValues,
    private dataService: SharedDataService,
    public printService: PrintService,
    public financialMgmService: FinancialMgmService) { }

  ngOnInit() {
    this.errorCntrler = new HandleErrorMsg(this._router);
    this.basicData = JSON.parse(localStorage.getItem('basicData'));
    this.sortF = CreditSearchEnum.updateTime.toString();
    this.sortO = SortOrder.desc.toString();
    this.creditSearch.workerSearch = true;
    this.creditSearch.sortById = CreditSearchEnum.updateTime;
    this.creditSearch.sortOrderId = SortOrder.desc;
    this.creditSearch.firstRow = 0;
    this.creditSearch.pageSize = Constant.lazyLoadingPageSize;
    this.initWorkerList();
  }

  changeSort(event) {
    this.sortF = event.field;
    this.sortO = event.order;
    this.creditSearch.sortById = Number.parseInt(event.field);
    if (event.order == -1)
      this.creditSearch.sortOrderId = SortOrder.desc;
    else
      this.creditSearch.sortOrderId = SortOrder.asc;
    this.initWorkerList();

  }
  initWorkerList() {
    let __workerList = [...this.workerList];
    this.loading = true;
    this.dataTableLoading = true;
    this.financialMgmService.creditSearch(this.creditSearch).subscribe(result => {
      this.dataTableLoading = false;
      this.loading = false;
      let temp: LastCreditSearchResult = <LastCreditSearchResult>result;
      __workerList = temp.workers;
      this.workerList = __workerList;
      this.totalRecords = temp.totalSize;
      this.showTransactionList();
    }, error => {
      this.loading = false;
      let obj: LastCreditSearchResult = error.error;
      let err: BackendMessage = obj.error;
      this.parseError(error.status, err);
      this.dataTableLoading = false;
    });
  }
  showInActiveFinance() {
    this.sortF = CreditSearchEnum.updateTime.toString();
    this.sortO = SortOrder.desc.toString();
    this.creditSearch.workerSearch = true;
    this.creditSearch.sortById = CreditSearchEnum.updateTime;
    this.creditSearch.sortOrderId = SortOrder.desc;
    this.creditSearch.firstRow = 0;
    this.creditSearch.pageSize = Constant.lazyLoadingPageSize;
    this.creditSearch.workerRegisterStateId = RegisterStateEnum.RegState_InActive_Finance;
    this.creditSearch.f_workerRegisterStateId = true;
    if (this.selectedFilter) {
      this.chipsFilterMap.clear();
      this.chipsFilterValues = [];
      this.selectedFilter.f_userFirstName = false;
      this.selectedFilter.userFirstName = null;
      this.filteredFirstName = null;
      this.selectedFilter.f_userLastName = false;
      this.selectedFilter.userLastName = null;
      this.filteredLastName = null;

      this.selectedFilter.f_workerCode = false;
      this.selectedFilter.workerCode = null;
      this.filteredCode = null;

      this.selectedFilter.f_credit = false;
      this.filteredTransactionAmountStart = 0;
      this.filteredTransactionAmountStop = 0;

      this.selectedFilter.f_updateTime = false;
      this.filteredUpdateStartDate = null;
      this.filteredUpdateStopDate = null;

      this.selectedFilter.f_workerRegisterStateId = false;
      this.filteredRegisterState = -1;
    }

    let __workerList = [...this.workerList];
    this.loading = true;
    this.dataTableLoading = true;
    this.financialMgmService.creditSearch(this.creditSearch).subscribe(result => {
      this.dataTableLoading = false;
      this.loading = false;
      let temp: LastCreditSearchResult = <LastCreditSearchResult>result;
      __workerList = temp.workers;
      this.workerList = __workerList;
      this.totalRecords = temp.totalSize;
      this.showTransactionList();
      if (!this.selectedFilter)
        this.selectedFilter = new LastCreditSearch();
      this.selectedFilter.f_workerRegisterStateId = true;
      this.selectedFilter.workerRegisterStateId = RegisterStateEnum.RegState_InActive_Finance;
      this.filteredRegisterState = RegisterStateEnum.RegState_InActive_Finance;
      let registerState: number = this.selectedFilter.workerRegisterStateId;
      let registerStateObj = this.basicData.filteredRegisterStateIDList.find(element => element.value == registerState);
      let registerStateLabel = registerStateObj.label;
      this.chipsFilterMap.set(this.shared.registerStateLabel + " : " + registerStateLabel, "f_registerState");
      this.chipsFilterValues.push(this.shared.registerStateLabel + " : " + registerStateLabel);

    }, error => {
      this.loading = false;
      let obj: LastCreditSearchResult = error.error;
      let err: BackendMessage = obj.error;
      this.parseError(error.status, err);
      this.dataTableLoading = false;
    });
  }

  loadRequestsLazy(event: LazyLoadEvent) {
    this.creditSearch.firstRow = event.first;
    this.creditSearch.totalSize = 0;
    this.creditSearch.pageSize = this.defaultPageSize;
    let __workerList = [...this.workerList];
    this.dataTableLoading = true;
    this.financialMgmService.creditSearch(this.creditSearch).subscribe(result => {
      let temp: LastCreditSearchResult = <LastCreditSearchResult>result;
      __workerList = temp.workers;
      this.workerList = __workerList;
      this.dataTableLoading = false;
    }, error => {
      let obj: LastCreditSearchResult = error.error;
      let err: BackendMessage = obj.error;
      this.parseError(error.status, err);
      this.dataTableLoading = false;
    });

  }
  showTransactionList() {
    this.displayWorkerList = true;

  }
  showFilterDialog() {
    this.displayFilterDialog = true;

  }
  onSearchFilterPanel(event) {
    try {
      this.displayFilterDialog = false;
      let data: WFinancialFilterSearchResult = event;
      let __workerList = [...this.workerList];

      __workerList = data.workers;
      this.workerList = __workerList;
      this.workerDataLoadedMap.clear();
      if (this.workerList != undefined) {
        this.workerList.forEach(element => {
          this.workerDataLoadedMap.set(element.id, true);
        });
      }
      this.totalRecords = data.totalSize;
      this.selectedFilter = data.lastCreditSearch;
      this.creditSearch = this.selectedFilter;
      this.filteredFirstName = data.selectedFirstName;
      this.filteredLastName = data.selectedLastName;
      this.filteredCode = data.selectedCode;
      this.filteredRegisterState = data.lastCreditSearch.workerRegisterStateId;
      this.filteredTransactionAmountStart = data.selectedTransactionAmountStart;
      this.filteredTransactionAmountStop = data.selectedTransactionAmountStop;
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
      if (this.selectedFilter.f_credit) {
        let amount: string = data.selectedTransactionAmountStart + "-" + data.selectedTransactionAmountStop;
        this.chipsFilterMap.set(this.shared.transactionAmountLabel + " : " + amount, "f_amount");
        this.chipsFilterValues.push(this.shared.transactionAmountLabel + " : " + amount);
      }
      if (this.selectedFilter.f_workerCode) {
        let workerCode: string = data.selectedCode;
        this.chipsFilterMap.set(this.shared.workerCodeLabel + " : " + workerCode, "f_workerCode");
        this.chipsFilterValues.push(this.shared.workerCodeLabel + " : " + workerCode);
      }
      if (this.selectedFilter.f_updateTime) {
        let updateTime: string = data.selectedUpdateStartDate + "--------------------" + data.selectedUpdateStopDate;
        this.chipsFilterMap.set(this.shared.registerPeriodTimeLabel + " : " + updateTime, "f_updateTime");
        this.chipsFilterValues.push(this.shared.registerPeriodTimeLabel + " : " + updateTime);
      }
      if (this.selectedFilter.f_workerRegisterStateId) {
        let registerState: number = data.lastCreditSearch.workerRegisterStateId;
        let registerStateObj = this.basicData.filteredRegisterStateIDList.find(element => element.value == registerState);
        let registerStateLabel = registerStateObj.label;
        this.chipsFilterMap.set(this.shared.registerStateLabel + " : " + registerStateLabel, "f_registerState");
        this.chipsFilterValues.push(this.shared.registerStateLabel + " : " + registerStateLabel);
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
      this.filteredFirstName = null;
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_userLastName') {
      this.selectedFilter.f_userLastName = false;
      this.selectedFilter.userLastName = null;
      this.filteredLastName = null;
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_workerCode') {
      this.selectedFilter.f_workerCode = false;
      this.selectedFilter.workerCode = null;
      this.filteredCode = null;
    }

    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_amount') {
      this.selectedFilter.f_credit = false;
      this.filteredTransactionAmountStart = 0;
      this.filteredTransactionAmountStop = 0;
    }

    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_updateTime') {
      this.selectedFilter.f_updateTime = false;
      this.filteredUpdateStartDate = null;
      this.filteredUpdateStopDate = null;
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_registerState') {
      this.selectedFilter.f_workerRegisterStateId = false;
      this.filteredRegisterState = -1;
    }
    this.dataTableLoading = true;
    this.workerDataLoadedMap.clear();
    this.workerList = [];
    let __workers = [...this.workerList];
    this.creditSearch = this.selectedFilter;
    this.selectedFilter.workerSearch = true;
    this.first = 0;

    this.financialMgmService.creditSearch(this.selectedFilter).subscribe(response => {
      this.workerList = [];
      let res: LastCreditSearchResult = <LastCreditSearchResult>response;
      let workers = res.workers;
      workers.forEach(element => {
        __workers.push(element);
        this.workerDataLoadedMap.set(element.id, true);
      });
      this.totalRecords = res.totalSize;
      this.displayFilterDialog = false;
      this.chipsFilterValues.splice(event, 1);
      this.chipsFilterMap.delete(selectedChipFilter);
      this.workerList = __workers;
      this.dataTableLoading = false;
    }, error => {
      let obj: LastCreditSearchResult = error.error;
      let err: BackendMessage = obj.error;
      this.parseError(error.status, err);
      this.dataTableLoading = false;
    });
  }
  onErrorFilterPanel(event) {
    this.hmsgs.push({ severity: 'error', summary: '', detail: event });
  }

  showTransactiontDetail(worker: WorkerP) {
    let id = worker.id;
    this.dataService.worker = worker;
    this.loadingDialog = true;
    this.displayTransactionView = true;
    this.selectedTransactionSearch = new TransactionSearch();
    this.selectedTransactionSearch.f_userId = true;
    this.selectedTransactionSearch.userId = worker.user.id;
    this.selecedWorkerCredit = worker.user.financialInfo.credit;
    this.transactionListHeader = this.shared.showTransactionList + " " + worker.user.firstName + " " + worker.user.lastName;
    this.dataService.transactionListHeader = this.transactionListHeader;

    this.financialMgmService.search(this.selectedTransactionSearch).subscribe(result => {
      this.selectedTransactionList = [];
      let res: TransactionSearchResult = <TransactionSearchResult>result;
      let transactions = res.transactionList;
      this.selectedTransactionList = transactions;
      this.selectedTransactionTotalRecords = res.totalSize;
      this.dataService.selectedTransactionTotalRecords = this.selectedTransactionTotalRecords;
      this.loadingDialog = false;
    }, error => {
      this.displayTransactionView = false;
      this.loadingDialog = false;

      let obj: TransactionP = error.error;
      let err: BackendMessage = obj.error;
      this.parseError(error.status, err);
    });
  }
  closeTransactionDetail() {
    this.displayTransactionView = false;
  }
  showRegisterDialog(worker: WorkerP) {
    this.selectedWorkerP = worker;
    console.log(this.selectedWorkerP);
    this.displayRegisterDialog = true;
  }
  onCloseRegisterPanel(event) {
    let transaction: TransactionP = event;
    let __workerList = [...this.workerList];
    let _index = this.findWorkerIndex(this.selectedWorkerP);
    this.selectedWorkerP.user.financialInfo.credit = transaction.balance;
    //this.selectedWorkerP.user.financialInfo.updateTime = transaction.
    __workerList[_index] = this.selectedWorkerP;
    this.workerList = __workerList;
    this.displayRegisterDialog = false;
  }
  findWorkerIndex(wr: WorkerP) {
    for (let i = 0; i < this.workerList.length; i++) {
      let element: WorkerP = this.workerList[i];
      if (element.id == wr.id)
        return i;
    }
  }
  showWorkerViewDialog(obj: WorkerP) {
    this.selectedWorkerID = obj.id;
    this.selectedWorkerFullName = obj.user.firstName + " " + obj.user.lastName;
    this.displayWorkerView = true;
  }
  onShowImage(event) {
    this.displayImageDialog = true;
    this.selectedImagePath = event;
  }
  closeViewDialog() {
    this.displayWorkerView = false;
  }
  onPrintInvoice() {
    this.printService
      .printDocument('transactionListPrintView');
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