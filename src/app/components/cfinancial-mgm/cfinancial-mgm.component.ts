import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionP } from 'app/pEntites/transactionP.class';
import { DiscountService } from 'app/services/discount.service';
import { FinancialMgmService } from 'app/services/financialMgm.service';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { BackendMessage } from '../../entities/Msg.class';
import { UserP } from '../../pEntites/userP.class';
import { HandleErrorMsg } from '../../shared/handleError.class';
import { BasicData } from './../../entities/basicData.class';
import { GrowlMessage } from './../../entities/growlMessage.class';
import { DiscountV } from './../../pEntites/discountV.class';
import { LastCreditSearch } from './../../pEntites/lastCreditSearch.class';
import { LastCreditSearchResult } from './../../pEntites/lastCreditSearchResult.class';
import { WFinancialFilterSearchResult } from './../../pEntites/lastCreditSearchResultFilter.class';
import { TransactionSearch } from './../../pEntites/transactionSearch.class';
import { TransactionSearchResult } from './../../pEntites/transactionSearchResult.class';
import { SharedValues } from './../../services/shared-values.service';
import { Constant } from './../../shared/constants.class';



@Component({
  selector: 'app-cfinancial-mgm',
  templateUrl: './cfinancial-mgm.component.html',
  styleUrls: ['./cfinancial-mgm.component.css'],
  providers: [FinancialMgmService, DiscountService]
})
export class CFinancialMgmComponent implements OnInit {
  activeLabel = this.shared.menuItem6SubItem3Label;
  hmsgs: GrowlMessage[] = [];
  loading = false;
  totalRecords: number;
  errorCntrler: HandleErrorMsg;
  basicData: BasicData;
  sortF: string = "";
  sortO: string = ""
  displayUserList = false;
  displayFilterDialog = false;
  displayTransactionView = false;
  displayRegisterDialog = false;

  userList: UserP[] = [];
  selectedTransactionList: TransactionP[] = [];
  selectedTransactionSearch: TransactionSearch = new TransactionSearch();
  selectedTransactionTotalRecords: number = 0;
  transactionListHeader: string = "";
  creditSearch: LastCreditSearch = new LastCreditSearch();
  chipsFilterValues: string[] = [];
  chipsFilterMap: Map<string, string> = new Map<string, string>();
  dataTableLoading: boolean = false;
  defaultPageSize: number = Constant.lazyLoadingPageSize;
  first: number = 0;
  currentPageIndex: number;
  selectedFilter: LastCreditSearch = null;
  filteredTransactionAmountStart: number;
  filteredTransactionAmountStop: number;
  filteredUpdateStartDate: string = null;
  filteredUpdateStopDate: string = null;
  filteredFirstName: string = null;
  filteredLastName: string = null;
  loadingDialog = false;
  selectedUserP: UserP = null;
  selectedUserBalance: number = 0;
  displayDiscountView = false;
  selectedDiscount: DiscountV;
  constructor(private _router: Router,
    public shared: SharedValues,
    public financialMgmService: FinancialMgmService,
    private discountService: DiscountService) { }

  ngOnInit() {
    this.errorCntrler = new HandleErrorMsg(this._router);
    this.basicData = JSON.parse(localStorage.getItem('basicData'));
    this.sortF = "2";
    this.sortO = "12";
    this.creditSearch.workerSearch = false;
    this.creditSearch.sortById = 2;
    this.creditSearch.sortOrderId = 2;
    this.creditSearch.firstRow = 0;
    this.creditSearch.pageSize = Constant.lazyLoadingPageSize;
    this.initUserList();
  }

  changeSort(event) {
    this.sortF = event.field;
    this.sortO = event.order;
    this.creditSearch.sortById = Number.parseInt(event.field);
    if (event.order == -1)
      this.creditSearch.sortOrderId = 2;
    else
      this.creditSearch.sortOrderId = 1;
    this.initUserList();

  }
  initUserList() {
    let __userList = [...this.userList];
    this.loading = true;
    this.dataTableLoading = true;

    this.financialMgmService.creditSearch(this.creditSearch).subscribe(result => {
      this.dataTableLoading = false;
      this.loading = false;
      let temp: LastCreditSearchResult = <LastCreditSearchResult>result;
      __userList = temp.users;
      this.userList = __userList;
      this.totalRecords = temp.totalSize;
      this.displayUserList = true;
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
    let __userList = [...this.userList];
    this.dataTableLoading = true;
    this.financialMgmService.creditSearch(this.creditSearch).subscribe(result => {
      let temp: LastCreditSearchResult = <LastCreditSearchResult>result;
      __userList = temp.users;
      this.userList = __userList;
      this.dataTableLoading = false;
    }, error => {
      let obj: LastCreditSearchResult = error.error;
      let err: BackendMessage = obj.error;
      this.parseError(error.status, err);
      this.dataTableLoading = false;
    });

  }

  showFilterDialog() {
    this.displayFilterDialog = true;

  }
  onSearchFilterPanel(event) {
    try {
      this.displayFilterDialog = false;
      let data: WFinancialFilterSearchResult = event;
      let __userList = [...this.userList];

      __userList = data.users;
      this.userList = __userList;

      this.totalRecords = data.totalSize;
      this.selectedFilter = data.lastCreditSearch;
      this.creditSearch = this.selectedFilter;
      this.filteredFirstName = data.selectedFirstName;
      this.filteredLastName = data.selectedLastName;
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

      if (this.selectedFilter.f_updateTime) {
        let updateTime: string = data.selectedUpdateStartDate + "--------------------" + data.selectedUpdateStopDate;
        this.chipsFilterMap.set(this.shared.registerPeriodTimeLabel + " : " + updateTime, "f_updateTime");
        this.chipsFilterValues.push(this.shared.registerPeriodTimeLabel + " : " + updateTime);
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

    this.dataTableLoading = true;
    this.userList = [];
    let __users = [...this.userList];
    this.creditSearch = this.selectedFilter;
    this.selectedFilter.workerSearch = false;
    this.first = 0;

    this.financialMgmService.creditSearch(this.selectedFilter).subscribe(response => {
      this.userList = [];
      let res: LastCreditSearchResult = <LastCreditSearchResult>response;
      let users = res.users;
      users.forEach(element => {
        __users.push(element);
      });
      this.totalRecords = res.totalSize;
      this.displayFilterDialog = false;
      this.chipsFilterValues.splice(event, 1);
      this.chipsFilterMap.delete(selectedChipFilter);
      this.userList = __users;
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
  showRegisterDialog(user: UserP) {
    this.selectedUserP = user;
    this.displayRegisterDialog = true;
  }
  onCloseRegisterPanel(event) {
    let transaction: TransactionP = event;
    let __userList = [...this.userList];
    let _index = this.findUserIndex(this.selectedUserP);
    this.selectedUserP.financialInfo.credit = transaction.balance;
    __userList[_index] = this.selectedUserP;
    this.userList = __userList;
    this.displayRegisterDialog = false;
  }
  findUserIndex(usr: UserP) {
    for (let i = 0; i < this.userList.length; i++) {
      let element: UserP = this.userList[i];
      if (element.id == usr.id)
        return i;
    }
  }
  showTransactiontDetail(user: UserP) {
    let id = user.id;
    this.selectedUserBalance = user.financialInfo.credit;
    this.loadingDialog = true;
    this.displayTransactionView = true;
    this.selectedTransactionSearch = new TransactionSearch();
    this.selectedTransactionSearch.f_userId = true;
    this.selectedTransactionSearch.userId = user.id;
    this.transactionListHeader = this.shared.showTransactionList + " " + user.firstName + " " + user.lastName;
    this.financialMgmService.search(this.selectedTransactionSearch).subscribe(result => {
      this.selectedTransactionList = [];
      let res: TransactionSearchResult = <TransactionSearchResult>result;
      let transactions = res.transactionList;
      this.selectedTransactionList = transactions;
      this.selectedTransactionTotalRecords = res.totalSize;
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

  showDiscount(event) {
    let id = event;
    this.loading = true;
    this.displayDiscountView = true;
    this.discountService.lookupByID(id).subscribe(result => {
      this.selectedDiscount = <DiscountV>result;
      this.loading = false;
    }, error => {
      this.displayDiscountView = false;
      this.loading = false;

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