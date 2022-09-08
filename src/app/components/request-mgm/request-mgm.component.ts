import { Sms } from './../../entities/sms.class';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestCommentV } from 'app/entities/requestCommentV.class';
import { RequestOfferP } from 'app/pEntites/requestOfferP.class';
import { ExcelService } from 'app/services/excel.service';
import * as moment from 'jalali-moment';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { ConfirmationService, DataTable, OverlayPanel } from 'primeng/primeng';
import { BackendMessage } from '../../entities/Msg.class';
import { RequestStateEnum } from '../../enums/requestState.enum';
import { UserRoleEnum } from '../../enums/userRole.enum';
import { CartableService } from '../../services/cartable.service';
import { InvoiceService } from '../../services/invoice.service';
import { JobOfferService } from '../../services/jobOffer.service';
import { Constant } from '../../shared/constants.class';
import { HandleErrorMsg } from '../../shared/handleError.class';
import { environment } from './../../../environments/environment';
import { Area } from './../../entities/area.class';
import { BasicData } from './../../entities/basicData.class';
import { City } from './../../entities/city.class';
import { GrowlMessage } from './../../entities/growlMessage.class';
import { Invoice } from './../../entities/invoice.class';
import { JobCategory1 } from './../../entities/JobCategory1.class';
import { JobCategory2 } from './../../entities/JobCategory2.class';
import { JobCategory3 } from './../../entities/JobCategory3.class';
import { Region } from './../../entities/region.class';
import { RequestSearch } from './../../entities/requestSearch.class';
import { RequestSearchResult } from './../../entities/requestSearchResult.class';
import { RequestState } from './../../entities/requestState.class';
import { RequestView } from './../../entities/requestView.class';
import { RequestFilterSearchResult } from './../../entities/roSearchResult.class';
import { InvoiceP } from './../../pEntites/invoiceP.class';
import { JobOfferCandidateP } from './../../pEntites/jobOfferCandidateP.class';
import { JobOfferP } from './../../pEntites/jobOfferP.class';
import { RequestP } from './../../pEntites/requestP.class';
import { RequestStateHistoryP } from './../../pEntites/requestStateHistoryP.class';
import { RequestMgmService } from './../../services/requestMgm.service';
import { SharedValues } from './../../services/shared-values.service';

@Component({
  selector: 'app-request-mgm',
  templateUrl: './request-mgm.component.html',
  providers: [RequestMgmService, JobOfferService, InvoiceService, CartableService, ExcelService],
  styleUrls: ['./request-mgm.component.css']
})
export class RequestMgmComponent implements OnInit {
  activeLabel: string;
  savedActiveLabel: string;

  @Input() requestStateTypeID = 0;
  @Input() requestStateTypeListID: number[] = [];
  @Input() showStateFilter: boolean = false;
  @Input() currentReqLoad: boolean = false;

  hmsgs: GrowlMessage[] = [];
  loading = false;
  loadingDialog = false;
  requestSearchResult: RequestSearchResult;
  requestList: RequestView[] = [];
  totalRecords: number;
  errorCntrler: HandleErrorMsg;

  expandedItems: Array<any> = new Array<any>();
  selectedRequest: RequestView;
  jobOfferList: JobOfferP[] = [];
  requestCandidateList: JobOfferCandidateP[] = [];
  requestStateHistory: RequestStateHistoryP[] = [];
  comments: RequestCommentV[] = [];
  displayRequestList = false;
  displayJobOfferList = false;
  displayWorkerCandidateList = false;
  displayFilterDialog = false;
  displayStateHistoryDialog = false;
  displayRequestCommentDialog = false;
  displayInvoiceDetail = false;
  displayRequestView = false;
  displayImageDialog = false;
  displayEditJobCatDialog = false;
  iloading = false;
  requestSearch: RequestSearch = new RequestSearch();
  chipsFilterValues: string[] = [];
  chipsFilterMap: Map<string, string> = new Map<string, string>();
  dataTableLoading: boolean = false;
  defaultPageSize: number = Constant.lazyLoadingPageSize;
  baseImagePath = environment.fileServerUrl;
  basicData: BasicData;

  filteredCode: string = null;
  filteredTitle: string = null;
  filteredJobCategory1: JobCategory1 = null;
  filteredJobCategory2: JobCategory2 = null;
  filteredJobCategory3: JobCategory3 = null;
  filteredRequestStateList: RequestState[] = [];
  filteredTransactionAmountStart: number = 0;
  filteredTransactionAmountStop: number = 0;
  filteredRegisterStartDate: string = null;
  filteredRegisterStopDate: string = null;
  filteredUpdateStartDate: string = null;
  filteredUpdateStopDate: string = null;
  filteredClientFirstName: string = null;
  filteredClientLastName: string = null;
  filteredClientMobileNumber: string = null;
  filteredCity: City = null;
  filteredRegion: Region = null;
  filteredArea: Area = null;
  filteredWorkerCode: string = null;
  filteredWorkerFirstName: string = null;
  filteredWorkerLastName: string = null;
  //provinceList:Province[] = [];
  requestDataLoadedMap: Map<number, boolean> = new Map<number, boolean>();
  selectedFilter: RequestSearch = new RequestSearch();
  sortF: string = "6";
  sortO: string = "-1";

  selectedInvoice: Invoice = null;
  selectedInvoiceP: InvoiceP = null;
  selectedRequestP: RequestP = null;
  selectedRequestCache: boolean = false;
  @ViewChild('requestDataTable') dataTable: DataTable;
  @ViewChild('userStatOP') userStatOP: OverlayPanel;
  first: number = 0;
  currentPageIndex: number;
  selectedImagePath: string;

  paramSubscriber: any;

  selectedRequestCode: string = "";
  adminFlag: boolean = false;
  mediumFlag: boolean = false;
  reqChangeFlag: boolean = false;
  permCancelFlag: boolean = false;
  permCloseFlag: boolean = false;
  permCandidWorkerFlag: boolean = false;
  permGoBackFlag: boolean = false;
  permCandidReferenceFlag = false;
  showStateFlag: boolean = false;
  displayWorkerView: boolean = false;
  selectedWorkerFullName: string = "";
  selectedWorkerID: number;
  showRequestStateFlag: boolean = true;
  dcolspan: number = 0;
  colspan_control: number = 1;

  jobCatEditForm: FormGroup;
  jobCat3Result: JobCategory3[] = [];

  requestCommentForm: FormGroup;
  displayAddCommentDialog = false;
  selectedJobOffer: JobOfferP = null;


  displaySMSPanel: boolean = false;

  sensSMSCapable: boolean = false;
  filteredSMSList: Sms[] = [];

  constructor(private _router: Router,
    private _fb: FormBuilder,
    private _activatedRouter: ActivatedRoute,
    public shared: SharedValues,
    private cdRef: ChangeDetectorRef,
    public requestMgmService: RequestMgmService,
    public invoiceService: InvoiceService,
    public jobOfferService: JobOfferService,
    private confirmationService: ConfirmationService,
    private _CartableService: CartableService,
    private excelService: ExcelService) { }

  ngOnInit() {

    this.errorCntrler = new HandleErrorMsg(this._router);
    this.basicData = JSON.parse(localStorage.getItem('basicData'));
    this.sortF = "6";
    this.sortO = "-1";
    let loggedInRole = Number(sessionStorage.getItem("roleId"));
    this.permCancelFlag = false;
    this.permCloseFlag = false;
    this.permCandidWorkerFlag = false;
    this.permGoBackFlag = false;
    this.permCandidReferenceFlag = false;
    if (loggedInRole == UserRoleEnum.SysAdmin ||
      loggedInRole == UserRoleEnum.Operator_H) {
      this.adminFlag = true;
    }
    if (loggedInRole == UserRoleEnum.SysAdmin ||
      loggedInRole == UserRoleEnum.Operator_H ||
      loggedInRole == UserRoleEnum.Operator_M ||
      loggedInRole == UserRoleEnum.Operator_L) {
      this.reqChangeFlag = true;
      this.sensSMSCapable = true;
    }
    if (loggedInRole == UserRoleEnum.SysAdmin ||
      loggedInRole == UserRoleEnum.Operator_H ||
      loggedInRole == UserRoleEnum.Operator_M) {
      this.permCandidReferenceFlag = true;
      this.mediumFlag = true;
    }

    if (this.requestStateTypeID != 0)
      this.handleRequestState(this.requestStateTypeID, false);
    else if (this.requestStateTypeListID != []) {
      this.activeLabel = this.shared.finishedRequestsLabel;
      this.requestSearch = new RequestSearch();
      this.requestSearch.f_stateId = true;
      this.requestStateTypeListID.forEach(element => {
        this.requestSearch.stateIdList.push(element);
      });
      this.currentReqLoad = false;
      this.permCancelFlag = false;
      this.dcolspan = 0;
      this.selectedFilter = new RequestSearch();
      this.selectedFilter.f_stateId = true;
      this.requestStateTypeListID.forEach(element => {
        this.selectedFilter.stateIdList.push(element);
      });
    }
    this.paramSubscriber = this._activatedRouter.params.subscribe(params => {
      let _load = params['load'];
      let _AllCurrent = params['current'];
      if (_load)
        this.handleRequestState(_load, _AllCurrent);

    });

    this.initRequestList();
    this.jobCatEditForm = this._fb.group({
      jobCategory3FormCntrl: ['', Validators.required]
    });
    this.requestCommentForm = this._fb.group({
      messageCntrl: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(1000)])]
    });
  }
  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }
  showUserStat(event, request) {
    this.selectedRequest = { ...request };
    this.userStatOP.show(event);
  }
  showCandidateWorkerList() {
    this.displayWorkerCandidateList = true;
  }
  exportExcel() {
    this.loading = true;

    this.requestSearch.pageSize = this.totalRecords;
    this.requestSearch.sortById = 6;
    this.requestSearch.sortOrderId = 2;

    this.requestMgmService.search(this.requestSearch).subscribe(result => {
      let temp: RequestSearchResult = <RequestSearchResult>result;
      let __requestList: RequestView[] = temp.requestList;
      this.excelService.exportAsExcelFile(__requestList, 'requestList_' + new Date().getDate());
    }, error => {

      let obj: RequestSearchResult = error.error;
      let err: BackendMessage = obj.error;
      this.parseError(error.status, err);
    }, () => {
      this.requestSearch.pageSize = 8;
      this.loading = false;
    });


  }


  paginate(event) {
    this.currentPageIndex = event.first / event.rows + 1 // Index of the new page if event.page not defined.
  }
  handleRequestState(_load: number, _AllCurrent: boolean) {
    if (_load == 0)
      return;
    if (_load == -1 && _AllCurrent) {
      let stateData: string = this.shared.allCurrentRequest;
      this.currentReqLoad = true;
      this.permCancelFlag = false;
      this.dcolspan = 0;
      this.activeLabel = this.shared.currentRequestsLabel;
      this.showRequestStateFlag = true;

      this.requestSearch = this.initCurrentStatesRequestSearch();
      this.selectedFilter = this.initCurrentStatesRequestSearch();

      this.filteredRequestStateList.push(this.rtvReqState(RequestStateEnum.waitToOffer, this.shared.reqWait4Suggest));
      this.filteredRequestStateList.push(this.rtvReqState(RequestStateEnum.offerTimeFinished, this.shared.reqSuggestFinished));
      this.filteredRequestStateList.push(this.rtvReqState(RequestStateEnum.Wait4DoAck, this.shared.reqWait4DoAck));
      this.filteredRequestStateList.push(this.rtvReqState(RequestStateEnum.ongoing, this.shared.reqInProgress));
      this.filteredRequestStateList.push(this.rtvReqState(RequestStateEnum.waitToPayment, this.shared.reqWait4Payment));
      this.filteredRequestStateList.push(this.rtvReqState(RequestStateEnum.waitToPoll, this.shared.reqWait4Nazarsanji));
    }
    if (_load == RequestStateEnum.waitToOffer) {

      let stateData: string = this.shared.reqWait4Suggest;
      this.currentReqLoad = true;
      this.permCancelFlag = this.currentReqLoad && this.adminFlag;
      this.dcolspan = 1;
      this.showRequestStateFlag = false;
      this.activeLabel = this.shared.currentRequestsLabel + " : " + stateData;

      this.requestSearch = this.initReqSearch(RequestStateEnum.waitToOffer);
      this.selectedFilter = this.initReqSearch(RequestStateEnum.waitToOffer);
      this.filteredRequestStateList.push(this.rtvReqState(RequestStateEnum.waitToOffer, this.shared.reqWait4Suggest));
    }
    else if (_load == RequestStateEnum.offerTimeFinished) {

      let stateData: string = this.shared.reqSuggestFinished;
      this.currentReqLoad = true;
      this.permCancelFlag = true;
      this.permGoBackFlag = this.currentReqLoad && this.mediumFlag;
      this.calculateColSpan();
      this.dcolspan = 1;
      this.showRequestStateFlag = false;
      this.activeLabel = this.shared.currentRequestsLabel + " : " + stateData;
      this.requestSearch = this.initReqSearch(RequestStateEnum.offerTimeFinished);
      this.selectedFilter = this.initReqSearch(RequestStateEnum.offerTimeFinished);
      this.filteredRequestStateList.push(this.rtvReqState(RequestStateEnum.offerTimeFinished, this.shared.reqSuggestFinished));

    }
    else if (_load == RequestStateEnum.Wait4DoAck) {
      let stateData: string = this.shared.reqWait4DoAck;
      this.activeLabel = this.shared.currentRequestsLabel + " : " + stateData;
      this.currentReqLoad = true;
      this.permCancelFlag = this.currentReqLoad && this.adminFlag;
      this.permGoBackFlag = this.currentReqLoad && this.mediumFlag;
      this.calculateColSpan();
      this.dcolspan = 1;
      this.showRequestStateFlag = false;
      this.requestSearch = this.initReqSearch(RequestStateEnum.Wait4DoAck);
      this.selectedFilter = this.initReqSearch(RequestStateEnum.Wait4DoAck);
      this.filteredRequestStateList.push(this.rtvReqState(RequestStateEnum.Wait4DoAck, this.shared.reqWait4DoAck));

    }

    else if (_load == RequestStateEnum.ongoing) {
      let stateData: string = this.shared.reqInProgress;
      this.activeLabel = this.shared.currentRequestsLabel + " : " + stateData;
      this.currentReqLoad = true;
      this.permCancelFlag = this.currentReqLoad && this.adminFlag;
      this.permGoBackFlag = this.currentReqLoad && this.mediumFlag;
      this.calculateColSpan();
      this.dcolspan = 1;
      this.showRequestStateFlag = false;
      this.requestSearch = this.initReqSearch(RequestStateEnum.ongoing);
      this.selectedFilter = this.initReqSearch(RequestStateEnum.ongoing);
      this.filteredRequestStateList.push(this.rtvReqState(RequestStateEnum.ongoing, this.shared.reqInProgress));
    }
    else if (_load == RequestStateEnum.waitToPayment) {
      this.currentReqLoad = true;
      let stateData: string = this.shared.reqWait4Payment;
      this.permGoBackFlag = this.currentReqLoad && this.mediumFlag;
      this.permCloseFlag = this.currentReqLoad && this.adminFlag;
      this.calculateColSpan();
      this.activeLabel = this.shared.currentRequestsLabel + " : " + stateData;


      this.dcolspan = 1;
      this.showRequestStateFlag = false;
      this.requestSearch = this.initReqSearch(RequestStateEnum.waitToPayment);
      this.selectedFilter = this.initReqSearch(RequestStateEnum.waitToPayment);
      this.filteredRequestStateList.push(this.rtvReqState(RequestStateEnum.waitToPayment, this.shared.reqWait4Payment));
    }
    else if (_load == RequestStateEnum.waitToPoll) {
      this.currentReqLoad = true;
      let stateData: string = this.shared.reqWait4Nazarsanji;
      this.permGoBackFlag = this.currentReqLoad && this.mediumFlag;
      this.permCloseFlag = this.currentReqLoad && this.adminFlag;
      this.calculateColSpan();

      this.activeLabel = this.shared.currentRequestsLabel + " : " + stateData;

      this.dcolspan = 1;
      this.showRequestStateFlag = false;
      this.requestSearch = this.initReqSearch(RequestStateEnum.waitToPoll);
      this.selectedFilter = this.initReqSearch(RequestStateEnum.waitToPoll);
      this.filteredRequestStateList.push(this.rtvReqState(RequestStateEnum.waitToPoll, this.shared.reqWait4Nazarsanji));
    }
    else if (_load == RequestStateEnum.finished) {
      let stateData: string = this.shared.reqFinished;
      this.permGoBackFlag = this.adminFlag;
      this.permCancelFlag = false;
      this.activeLabel = this.shared.finishedRequestsLabel + " : " + stateData;
      this.currentReqLoad = false;
      this.calculateColSpan();

      this.dcolspan = 1;
      this.showRequestStateFlag = false;

      this.requestSearch = this.initReqSearch(RequestStateEnum.finished);
      this.selectedFilter = this.initReqSearch(RequestStateEnum.finished);
      this.filteredRequestStateList.push(this.rtvReqState(RequestStateEnum.finished, this.shared.reqFinished));
    }
    else if (_load == RequestStateEnum.canceled) {
      let stateData: string = this.shared.reqCancelByC;
      this.activeLabel = this.shared.finishedRequestsLabel + " : " + stateData;
      this.currentReqLoad = false;
      this.permCancelFlag = false;
      this.permGoBackFlag = this.mediumFlag;
      this.calculateColSpan();
      this.showRequestStateFlag = false;

      this.requestSearch = this.initReqSearch(RequestStateEnum.canceled);
      this.selectedFilter = this.initReqSearch(RequestStateEnum.canceled);
      this.filteredRequestStateList.push(this.rtvReqState(RequestStateEnum.canceled, this.shared.reqCancelByC));
    }
    else if (_load == RequestStateEnum.canceledByOperator) {
      let stateData: string = this.shared.reqCancelByO;
      this.activeLabel = this.shared.finishedRequestsLabel + " : " + stateData;
      this.currentReqLoad = false;
      this.permCancelFlag = false;
      this.permGoBackFlag = this.mediumFlag;
      this.showRequestStateFlag = false;
      this.calculateColSpan();

      this.requestSearch = this.initReqSearch(RequestStateEnum.canceledByOperator);
      this.selectedFilter = this.initReqSearch(RequestStateEnum.canceledByOperator);
      this.filteredRequestStateList.push(this.rtvReqState(RequestStateEnum.canceledByOperator, this.shared.reqCancelByO));
    }
    else if (_load == RequestStateEnum.canceledByWorker) {
      let stateData: string = this.shared.reqCancelByW;
      this.activeLabel = this.shared.finishedRequestsLabel + " : " + stateData;
      this.currentReqLoad = false;
      this.permCancelFlag = false;
      this.permGoBackFlag = this.mediumFlag;
      this.calculateColSpan();
      this.showRequestStateFlag = false;

      this.requestSearch = this.initReqSearch(RequestStateEnum.canceledByWorker);
      this.selectedFilter = this.initReqSearch(RequestStateEnum.canceledByWorker);
      this.filteredRequestStateList.push(this.rtvReqState(RequestStateEnum.canceledByWorker, this.shared.reqCancelByW));

    }
    else if (_load == RequestStateEnum.expired) {
      let stateData: string = this.shared.expiredLabel;
      this.activeLabel = this.shared.finishedRequestsLabel + " : " + stateData;
      this.currentReqLoad = false;
      this.permCancelFlag = false;
      this.permGoBackFlag = this.adminFlag;
      this.calculateColSpan();
      this.showRequestStateFlag = false;

      this.requestSearch = this.initReqSearch(RequestStateEnum.expired);
      this.selectedFilter = this.initReqSearch(RequestStateEnum.expired);
      this.filteredRequestStateList.push(this.rtvReqState(RequestStateEnum.expired, this.shared.expiredLabel));
    }
    else if (_load == RequestStateEnum.all) {
      let stateData: string = this.shared.allRequests;
      this.activeLabel = stateData;
      this.currentReqLoad = false;
      this.permCancelFlag = false;
      this.permCloseFlag = false;
      this.permGoBackFlag = false;
      this.showRequestStateFlag = false;
      this.showStateFlag = true;
      this.requestSearch = new RequestSearch();
      this.requestSearch.f_stateId = false;
      this.selectedFilter = new RequestSearch();
      this.selectedFilter.f_stateId = false;
    }
  }
  initRequestList() {
    let __requestList = [...this.requestList];
    this.loading = true;
    this.dataTableLoading = true;
    this.requestSearch.sortById = 6;
    this.requestSearch.sortOrderId = 2;
    this.requestSearch.f_registerTime = false;
    this.requestMgmService.search(this.requestSearch).subscribe(result => {
      //console.log(result);
      this.dataTableLoading = false;
      this.loading = false;
      let temp: RequestSearchResult = <RequestSearchResult>result;
      __requestList = temp.requestList;
      this.requestList = __requestList;
      this.totalRecords = temp.totalSize;
      this.showRequestList();
    }, error => {
      //console.log(error);
      this.loading = false;
      let obj: RequestSearchResult = error.error;
      let err: BackendMessage = obj.error;
      this.parseError(error.status, err);
      this.dataTableLoading = false;
    });

  }
  refreshRequestList() {
    let __requestList = [...this.requestList];
    this.dataTableLoading = true;
    this.requestMgmService.search(this.requestSearch).subscribe(result => {
      this.dataTableLoading = false;
      let temp: RequestSearchResult = <RequestSearchResult>result;
      __requestList = temp.requestList;
      this.requestList = __requestList;
      this.totalRecords = temp.totalSize;
      this.dataTable.first = 1;

    }, error => {
      let obj: RequestSearchResult = error.error;
      let err: BackendMessage = obj.error;
      this.parseError(error.status, err);
      this.dataTableLoading = false;
    });

  }


  showSuggestionListNew(request: RequestView) {
    this.dataTableLoading = true;
    this.selectedRequest = { ...request };

    this.jobOfferService.getListPerReqIdNew(request.id).subscribe(result => {
      console.log(result);
      let requsetOfferP = <RequestOfferP>result;
      this.jobOfferList = requsetOfferP.offers;
      this.requestCandidateList = requsetOfferP.candidates;
      this.dataTableLoading = false;
      this.displayRequestList = false;
      this.displayJobOfferList = true;
      this.savedActiveLabel = this.activeLabel;
      this.activeLabel = this.shared.jobOfferListLabel;
    }, error => {
      this.dataTableLoading = false;
      this.displayJobOfferList = false;
      let err: BackendMessage = error.error.error;
      this.parseError(error.status, err);
    });
  }

  showRequestStateHistoryList(request) {
    this.selectedRequest = request;
    this.dataTableLoading = true;
    this.requestMgmService.rtvStateHistory(request.id).subscribe(result => {
      this.requestStateHistory = <RequestStateHistoryP[]>result;
      this.dataTableLoading = false;
      this.displayStateHistoryDialog = true;
    }, error => {
      this.displayStateHistoryDialog = false;
      this.dataTableLoading = false;
      let obj: RequestStateHistoryP[] = error.error;
      let err: BackendMessage = obj[0].error;
      this.parseError(error.status, err);
    });

  }
  showFollowUP(request: RequestView) {
    this.selectedRequest = request;
    this.dataTableLoading = true;
    this.requestMgmService.comments(request.id).subscribe(result => {
      this.comments = <RequestCommentV[]>result;
      this.dataTableLoading = false;
      this.displayRequestCommentDialog = true;
      this.displayAddCommentDialog = false;
    }, error => {
      this.displayRequestCommentDialog = false;
      this.dataTableLoading = false;
      let obj: RequestSearchResult = error.error;
      let err: BackendMessage = obj.error;
      this.parseError(error.status, error);
    });
  }
  showAdddComment() {
    this.requestCommentForm.controls["messageCntrl"].setValue('');
    this.displayAddCommentDialog = true;
  }
  showRequestDetail(requestView: RequestView) {
    let id = requestView.id;
    this.loadingDialog = true;
    this.displayRequestView = true;
    this.selectedRequestCode = requestView.code;
    this.requestMgmService.lookupByIdP(id).subscribe(result => {
      console.log(result);
      this.selectedRequestP = <RequestP>result;
      this.selectedRequestCache = requestView.cash;
      this.loadingDialog = false;
    }, error => {
      this.displayRequestView = false;
      this.loadingDialog = false;

      let obj: RequestP = error.error;
      let err: BackendMessage = obj.error;
      this.parseError(error.status, err);
    });
  }

  changeSort(event) {
    this.sortF = event.field;
    this.sortO = event.order;
    this.requestSearch.sortById = Number.parseInt(event.field);
    if (event.order == -1)
      this.requestSearch.sortOrderId = 2;
    else
      this.requestSearch.sortOrderId = 1;
    this.refreshRequestList();

  }
  showRequestList() {
    this.displayRequestList = true;
    this.displayJobOfferList = false;

    //this.clearFilter();

  }

  backToRequestList() {
    this.displayRequestList = true;
    this.displayJobOfferList = false;
    this.activeLabel = this.savedActiveLabel;
  }
  showFilterDialog() {
    this.displayFilterDialog = true;
  }

  showPreInvoiceItems(request: RequestView) {
    let invoiceID = request.preInvoiceId;
    this.selectedInvoiceP = null;
    this.selectedInvoice = null;
    this.invoiceService.lookupById(invoiceID).subscribe(result => {
      let temp: InvoiceP = <InvoiceP>result;
      this.selectedInvoiceP = temp;
      this.displayInvoiceDetail = true;
    }, error => {
      let obj: RequestSearchResult = error.error;
      let err: BackendMessage = obj.error;
      this.parseError(error.status, err);
      this.dataTableLoading = false;
    });
  }
  showPreInvoiceItemsByJobOffer(jobOffer: JobOfferP) {
    try {
      if (jobOffer == null)
        throw new Error('Something bad happened');
      if (jobOffer == undefined)
        throw new Error('Something bad happened');
      if (jobOffer.suggestion == null)
        throw new Error('Something bad happened');
      if (jobOffer.suggestion == undefined)
        throw new Error('Something bad happened');
      if (jobOffer.suggestion.invoice == null)
        throw new Error('Something bad happened');
      if (jobOffer.suggestion.invoice == undefined)
        throw new Error('Something bad happened');

      this.displayInvoiceDetail = true;
      this.selectedInvoiceP = null;
      this.selectedInvoice = jobOffer.suggestion.invoice;
    }
    catch (e) {
      console.log(e);
    }
  }
  showSurveyInvoiceItems(request: RequestView) {
    let invoiceID = request.proformaInvoiceId;
    this.selectedInvoiceP = null;
    this.selectedInvoice = null;
    this.invoiceService.lookupById(invoiceID).subscribe(result => {
      let temp: InvoiceP = <InvoiceP>result;
      this.selectedInvoiceP = temp;
      this.displayInvoiceDetail = true;
    }, error => {
      let obj: RequestSearchResult = error.error;
      let err: BackendMessage = obj.error;
      this.parseError(error.status, err);
      this.dataTableLoading = false;
    });
  }
  showFinalInvoiceItems(request: RequestView) {
    console.log(request);
    let invoiceID = request.finalInvoiceId;
    this.selectedInvoiceP = null;
    this.selectedInvoice = null;
    this.invoiceService.lookupById(invoiceID).subscribe(result => {
      let temp: InvoiceP = <InvoiceP>result;
      this.selectedInvoiceP = temp;
      this.displayInvoiceDetail = true;
    }, error => {
      let obj: RequestSearchResult = error.error;
      let err: BackendMessage = obj.error;
      this.parseError(error.status, err);
      this.dataTableLoading = false;
    });
  }


  loadRequestsLazy(event: LazyLoadEvent) {
    this.requestSearch.firstRow = event.first;
    this.requestSearch.totalSize = 0;
    this.requestSearch.pageSize = this.defaultPageSize;
    let __requestList = [...this.requestList];
    this.dataTableLoading = true;
    this.requestMgmService.search(this.requestSearch).subscribe(result => {
      let temp: RequestSearchResult = <RequestSearchResult>result;
      __requestList = temp.requestList;
      this.requestList = __requestList;
      this.dataTableLoading = false;
    }, error => {
      let obj: RequestSearchResult = error.error;
      let err: BackendMessage = obj.error;
      this.parseError(error.status, err);
      this.dataTableLoading = false;
    });

  }
  cancelRequest(request) {

    this.confirmationService.confirm({
      message: this.shared.confirmText,
      accept: () => {
        this.selectedRequest = request;
        this.dataTableLoading = true;
        //let list = [...this.requestList];
        this._CartableService.cancelExipredRequest(request).subscribe(result => {
          let index = this.findRequestIndex(request);
          this.requestList = this.requestList.filter((val, i) => i != index);
          this.totalRecords = this.totalRecords - 1;
          this.dataTableLoading = false;
        }, error => {
          this.dataTableLoading = false;
          let err: BackendMessage = error.error;
          this.parseError(error.status, err);
        });
      }
    });
  }
  closeRequest(request: RequestView) {
    this.confirmationService.confirm({
      message: this.shared.confirmText,
      accept: () => {
        this.selectedRequest = request;
        this.dataTableLoading = true;
        this._CartableService.closeRequest(request.id).subscribe(response => {
          let index = this.findRequestIndex(request);
          this.requestList = this.requestList.filter((val, i) => i != index);
          this.totalRecords = this.totalRecords - 1;
          this.dataTableLoading = false;
        }, error => {
          console.log(error);
          this.dataTableLoading = false;
          let err: BackendMessage = error.error;
          this.parseError(error.status, err);
        })
      }
    });
  }
  rollBackRequest(request) {
    let id = request.id;
    this.confirmationService.confirm({
      message: this.shared.confirmText,
      accept: () => {
        this.selectedRequest = request;
        this.dataTableLoading = true;
        //let list = [...this.requestList];
        this.requestMgmService.rollBack(id).subscribe(result => {
          let index = this.findRequestIndex(request);
          this.requestList = this.requestList.filter((val, i) => i != index);
          this.totalRecords = this.totalRecords - 1;
          this.dataTableLoading = false;
        }, error => {
          this.dataTableLoading = false;
          let err: BackendMessage = error.error;
          this.parseError(error.status, err);
        });
      }
    });
  }
  goBackRequest(request) {
    let id = request.id;
    this.confirmationService.confirm({
      message: this.shared.confirmText,
      accept: () => {
        this.selectedRequest = request;
        this.dataTableLoading = true;
        //let list = [...this.requestList];
        this.requestMgmService.goBack(id).subscribe(result => {
          let index = this.findRequestIndex(request);
          this.requestList = this.requestList.filter((val, i) => i != index);
          this.totalRecords = this.totalRecords - 1;
          this.dataTableLoading = false;
        }, error => {
          this.dataTableLoading = false;
          let err: BackendMessage = error.error;
          this.parseError(error.status, err);
        });
      }
    });
  }
  reActive(jobOffer: JobOfferP) {
    let id = jobOffer.id;
    this.confirmationService.confirm({
      message: this.shared.confirmText,
      accept: () => {
        this.selectedJobOffer = jobOffer;
        this.dataTableLoading = true;
        this.requestMgmService.reActiveOffer(id).subscribe(result => {
          this.dataTableLoading = false;
          this.showSuggestionListNew(this.selectedRequest);
        }, error => {
          this.dataTableLoading = false;
          let err: BackendMessage = error.error;
          this.parseError(error.status, err);
        });
      }
    });
  }
  public findRequestIndex(rq: RequestView): number {
    for (let i = 0; i < this.requestList.length; i++) {
      let element: RequestView = this.requestList[i];
      if (element.id == rq.id)
        return i;
    }
  }
  onRowExpand(event) {
    let _list: Array<any> = [];
    let toBeExpandedRequest: RequestView = <RequestView>event.data;
    this.expandedItems.forEach(element => {
      let request: RequestView = <RequestView>element;
      this.selectedRequest = request;
      if (request.id == toBeExpandedRequest.id) {
        _list.push(element);
      }

    });
    this.expandedItems = _list;
  }
  onSearchFilterPanel(event) {
    try {

      let data: RequestFilterSearchResult = event;
      let __requests = [...this.requestList];

      __requests = data.requests;
      this.requestList = __requests;
      this.requestDataLoadedMap.clear();
      this.requestList.forEach(element => {
        this.requestDataLoadedMap.set(element.id, true);
      });
      this.totalRecords = data.totalSize;
      this.selectedFilter = data.requestSearch;
      this.requestSearch = data.requestSearch;
      this.filteredTitle = data.selectedTitle;
      this.filteredCode = data.selectedCode;
      this.filteredJobCategory1 = data.selectedJobCategory1;
      this.filteredJobCategory2 = data.selectedJobCategory2;
      this.filteredJobCategory3 = data.selectedJobCategory3;
      this.filteredClientFirstName = data.selectedClientFirstName;
      this.filteredClientLastName = data.selectedClientLastName;
      this.filteredClientMobileNumber = data.selectedClientMobileNumber;
      this.filteredCity = data.selectedCity;
      this.filteredRegion = data.selectedRegion;
      this.filteredArea = data.selectedArea;
      this.filteredRegisterStartDate = data.selectedRegisterStartDate;
      this.filteredRegisterStopDate = data.selectedRegisterStopDate;
      this.filteredUpdateStartDate = data.selectedUpdateStartDate;
      this.filteredUpdateStopDate = data.selectedUpdateStopDate;
      this.filteredTransactionAmountStart = data.selectedRequestPriceStart;
      this.filteredTransactionAmountStop = data.selectedRequestPriceStop;
      this.filteredWorkerCode = data.selectedWorkerCode;
      this.filteredWorkerFirstName = data.selectedWorkerFirstName;
      this.filteredWorkerLastName = data.selectedWorkerLastName;
      this.displayFilterDialog = false;
      this.chipsFilterMap.clear();
      this.chipsFilterValues = [];
      if (this.selectedFilter.f_title) {
        let title: string = data.selectedTitle;
        this.chipsFilterMap.set(this.shared.titleLabel + " : " + title, "f_title");
        this.chipsFilterValues.push(this.shared.titleLabel + " : " + title);
      }
      if (this.selectedFilter.f_code) {
        let code: string = data.selectedCode;
        this.chipsFilterMap.set(this.shared.workerCodeLabel + " : " + code, "f_code");
        this.chipsFilterValues.push(this.shared.workerCodeLabel + " : " + code);
      }
      if (this.selectedFilter.f_stateId) {
        let requestStateList = data.selectedRequestStateList;
        requestStateList.forEach(req => {
          this.chipsFilterMap.set(this.shared.state + " : " + req.name, "f_stateId");
          this.chipsFilterValues.push(this.shared.state + " : " + req.name);
        });

      }
      if (this.selectedFilter.f_jobCategory1Id) {
        let jc1: JobCategory1 = data.selectedJobCategory1;
        this.chipsFilterMap.set(jc1.name, "f_jobCategory1Id");
        this.chipsFilterValues.push(jc1.name);
      }
      if (this.selectedFilter.f_jobCategory2Id) {
        let jc2: JobCategory2 = data.selectedJobCategory2;
        this.chipsFilterMap.set(jc2.name, "f_jobCategory2Id");
        this.chipsFilterValues.push(jc2.name);
      }
      if (this.selectedFilter.f_jobCategory3Id) {
        let jc3: JobCategory3 = data.selectedJobCategory3;
        this.chipsFilterMap.set(jc3.name, "f_jobCategory3Id");
        this.chipsFilterValues.push(jc3.name);
      }

      if (this.selectedFilter.f_clientFirstName) {
        let firstName: string = data.selectedClientFirstName;
        this.chipsFilterMap.set(this.shared.firstNameLabel + " " + this.shared.clientLabel + " : " + firstName, "f_c_firstName");
        this.chipsFilterValues.push(this.shared.firstNameLabel + " " + this.shared.clientLabel + " : " + firstName);
      }
      if (this.selectedFilter.f_clientLastName) {
        let lastName: string = data.selectedClientLastName;
        this.chipsFilterMap.set(this.shared.lastNameLabel + " " + this.shared.clientLabel + " : " + lastName, "f_c_lastName");
        this.chipsFilterValues.push(this.shared.lastNameLabel + " " + this.shared.clientLabel + " : " + lastName);
      }

      if (this.selectedFilter.f_clientMobileNumber) {
        let mobileNumber: string = data.selectedClientMobileNumber;
        this.chipsFilterMap.set(this.shared.mobileLabel + " " + this.shared.clientLabel + " : " + mobileNumber, "f_c_mobileNumber");
        this.chipsFilterValues.push(this.shared.mobileLabel + " " + this.shared.clientLabel + " : " + mobileNumber);
      }
      if (this.selectedFilter.f_cityId) {
        let cityId: number = data.selectedCity.id;
        this.chipsFilterMap.set(this.shared.cityLabel + " : " + data.selectedCity.name, "f_cityId");
        this.chipsFilterValues.push(this.shared.cityLabel + " : " + data.selectedCity.name);
      }
      if (this.selectedFilter.f_regionId) {
        let regionId: number = data.selectedRegion.id;
        this.chipsFilterMap.set(this.shared.regionLabel + " : " + data.selectedRegion.name, "f_regionId");
        this.chipsFilterValues.push(this.shared.regionLabel + " : " + data.selectedRegion.name);
      }
      if (this.selectedFilter.f_areaId) {
        let areaId: number = data.selectedArea.id;
        this.chipsFilterMap.set(this.shared.areaLabel + " : " + data.selectedArea.name, "f_areaId");
        this.chipsFilterValues.push(this.shared.areaLabel + " : " + data.selectedArea.name);
      }
      if (this.selectedFilter.f_registerTime) {
        let registerTime: string = data.selectedRegisterStartDate + " " + data.selectedRegisterStopDate;
        this.chipsFilterMap.set(this.shared.registerPeriodTimeLabel + " : " + registerTime, "f_registerTime");
        this.chipsFilterValues.push(this.shared.registerPeriodTimeLabel + " : " + registerTime);
      }
      if (this.selectedFilter.f_updateTime) {
        let updateTime: string = data.selectedUpdateStartDate + " " + data.selectedUpdateStopDate;
        this.chipsFilterMap.set(this.shared.updatePeriodTimeLabel + " : " + updateTime, "f_updateTime");
        this.chipsFilterValues.push(this.shared.updatePeriodTimeLabel + " : " + updateTime);
      }
      if (this.selectedFilter.f_selectedWorkerCode) {
        let code: string = data.selectedWorkerCode;
        this.chipsFilterMap.set(this.shared.workerCodeLabel + " : " + code, "f_selectedWorkerCode");
        this.chipsFilterValues.push(this.shared.workerCodeLabel + " : " + code);
      }
      if (this.selectedFilter.f_price) {
        let price: string = data.selectedRequestPriceStart + "-" + data.selectedRequestPriceStop;
        this.chipsFilterMap.set(this.shared.requestPricePeriodLabel + " : " + price, "f_price");
        this.chipsFilterValues.push(this.shared.requestPricePeriodLabel + " : " + price);
      }
      if (this.selectedFilter.f_workerFirstName) {
        let firstName: string = data.selectedWorkerFirstName;
        this.chipsFilterMap.set(this.shared.firstNameLabel + " " + this.shared.workerLabel + " : " + firstName, "f_w_firstName");
        this.chipsFilterValues.push(this.shared.firstNameLabel + " " + this.shared.workerLabel + " : " + firstName);
      }
      if (this.selectedFilter.f_workerLastName) {
        let lastName: string = data.selectedWorkerLastName;
        this.chipsFilterMap.set(this.shared.lastNameLabel + " " + this.shared.workerLabel + " : " + lastName, "f_w_lastName");
        this.chipsFilterValues.push(this.shared.lastNameLabel + " " + this.shared.workerLabel + " : " + lastName);
      }

    }
    catch (e) {
      console.log(e);
    }

  }
  onRemoveChip(event) {

    let selectedChipFilter: string = this.chipsFilterValues[event];
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_title') {
      this.selectedFilter.f_title = false;
      this.selectedFilter.title = null;
      this.filteredTitle = null;
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_code') {
      this.selectedFilter.f_code = false;
      this.selectedFilter.code = null;
      this.filteredCode = null;
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_stateId') {
      this.selectedFilter.f_stateId = false;
      this.requestSearch.stateIdList = [];
      this.filteredRequestStateList = [];
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_jobCategory1Id') {
      this.selectedFilter.f_jobCategory1Id = false;
      this.selectedFilter.f_jobCategory2Id = false;
      this.selectedFilter.f_jobCategory3Id = false;
      this.filteredJobCategory1 = null;
      this.filteredJobCategory2 = null;
      this.filteredJobCategory3 = null;
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_jobCategory2Id') {
      this.filteredJobCategory2 = null;
      this.filteredJobCategory3 = null;
      this.selectedFilter.f_jobCategory2Id = false;
      this.selectedFilter.f_jobCategory3Id = false;
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_jobCategory3Id') {
      this.selectedFilter.f_jobCategory3Id = false;
      this.filteredJobCategory3 = null;
    }

    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_c_firstName') {
      this.selectedFilter.f_clientFirstName = false;
      this.filteredClientFirstName = "";
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_c_lastName') {
      this.selectedFilter.f_clientLastName = false;
      this.filteredClientLastName = "";
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_c_mobileNumber') {
      this.selectedFilter.f_clientMobileNumber = false;
      this.filteredClientMobileNumber = "";
    }

    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_cityId') {
      this.selectedFilter.f_cityId = false;
      this.filteredCity = null;
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_regionId') {
      this.selectedFilter.f_regionId = false;
      this.filteredRegion = null;
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_areaId') {
      this.selectedFilter.f_areaId = false;
      this.filteredArea = null;
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_registerTime') {
      this.selectedFilter.f_registerTime = false;
      this.filteredRegisterStartDate = null;
      this.filteredRegisterStopDate = null;
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_updateTime') {
      this.selectedFilter.f_updateTime = false;
      this.filteredUpdateStartDate = null;
      this.filteredUpdateStopDate = null;
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_selectedWorkerCode') {
      this.selectedFilter.f_selectedWorkerCode = false;
      this.filteredWorkerCode = null;
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_price') {
      this.selectedFilter.f_price = false;
      this.filteredTransactionAmountStart = 0;
      this.filteredTransactionAmountStop = 0;
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_w_firstName') {
      this.selectedFilter.f_workerFirstName = false;
      this.filteredWorkerFirstName = "";
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_w_lastName') {
      this.selectedFilter.f_workerLastName = false;
      this.filteredWorkerLastName = "";
    }

    this.dataTableLoading = true;
    this.requestDataLoadedMap.clear();
    this.requestList = [];
    let __requests = [...this.requestList];
    this.requestSearch = this.selectedFilter;
    this.requestMgmService.search(this.selectedFilter).subscribe(response => {
      this.requestList = [];
      let res: RequestSearchResult = <RequestSearchResult>response;
      let requests = res.requestList;
      requests.forEach(element => {
        __requests.push(element);
        this.requestDataLoadedMap.set(element.id, true);
      });
      this.totalRecords = res.totalSize;
      this.displayFilterDialog = false;
      this.chipsFilterValues.splice(event, 1);
      this.chipsFilterMap.delete(selectedChipFilter);
      this.requestList = __requests;
      this.dataTableLoading = false;
    }, error => {
      let obj: RequestSearchResult = error.error;
      let err: BackendMessage = obj.error;
      this.parseError(error.status, err);
      this.dataTableLoading = false;
    });
  }
  onErrorFilterPanel(event) {
    this.hmsgs.push({ severity: 'error', summary: '', detail: event });
  }
  showWorkerViewDialog(obj: JobOfferP) {
    this.selectedWorkerID = obj.worker.id;
    this.selectedWorkerFullName = obj.worker.user.firstName + " " + obj.worker.user.lastName;
    this.displayWorkerView = true;
  }
  onShowImage(event) {
    this.displayImageDialog = true;
    this.selectedImagePath = event;
  }
  closeViewDialog() {
    this.displayWorkerView = false;
  }
  closeCandidateWorkerViewDialog() {
    this.displayWorkerCandidateList = false;
  }
  sendOffer(workerID: number) {
    let requestID = this.selectedRequest.id;
    this.jobOfferService.sendOffer(requestID, workerID).subscribe(response => {
      this.displayWorkerCandidateList = false;
      this.showSuggestionListNew(this.selectedRequest);
    }, error => {
      let err: BackendMessage = error.error;
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
  openJobCatEdit(request: RequestView) {
    this.jobCatEditForm.reset();
    this.selectedRequest = request;
    this.selectedRequestCode = request.code;
    this.displayEditJobCatDialog = true;
  }
  onSubmitJobCat3Edit() {
    let jcID = this.jobCatEditForm.controls['jobCategory3FormCntrl'].value.id;
    let jcName = this.jobCatEditForm.controls['jobCategory3FormCntrl'].value.name;
    let _requests = [...this.requestList];
    if (jcID != undefined) {
      this.iloading = true;
      this.requestMgmService.changeRequest(this.selectedRequest.id, jcID).subscribe(response => {
        this.selectedRequest.cat3 = jcName;
        let index = this.findRequestIndex(this.selectedRequest);
        _requests[index] = this.selectedRequest;
        this.requestList = _requests;
        this.displayEditJobCatDialog = false;
      }, error => {
        let err: BackendMessage = error.error;
        this.parseError(error.status, err);
      }, () => {
        this.iloading = false;
      });
    }
    else {
      this.hmsgs.push({ severity: 'error', summary: '', detail: this.shared.selectNewCat3 });
      return;
    }

  }
  onSubmitRequestComment() {
    let msg = this.requestCommentForm.controls["messageCntrl"].value;
    let comment = new RequestCommentV();
    comment.message = msg;
    let list = { ...this.comments };
    this.requestMgmService.addComment(this.selectedRequest.id, comment).subscribe(result => {

      this.displayRequestCommentDialog = false;
    }, error => {
      console.log(error);
      this.displayRequestCommentDialog = false;
      let err: any = error.error;
      this.parseError(error.status, err.error);
    });
  }
  searchJobCat3(event) {
    this.jobCat3Result = [];
    let value = event.query;
    this.basicData.jobCategory3DataList.forEach(elemant => {
      if (elemant.name.indexOf(value) != -1) {
        this.jobCat3Result.push(elemant);
      }
    });
  }
  rtvTodayList() {

    let __requestList = [...this.requestList];
    this.loading = true;
    this.dataTableLoading = true;
    this.requestSearch.sortById = 6;
    this.requestSearch.sortOrderId = 2;

    let startOfToday = moment().startOf('day');

    let today = moment(new Date());
    this.requestSearch.registerTimeStart = moment(startOfToday).locale('fa').format('YYYY/MM/DD HH:mm:ss');
    this.requestSearch.registerTimeEnd = moment(today).locale('fa').format('YYYY/MM/DD HH:mm:ss');
    this.requestSearch.f_registerTime = true;

    this.requestMgmService.search(this.requestSearch).subscribe(result => {

      this.dataTableLoading = false;
      this.loading = false;
      let temp: RequestSearchResult = <RequestSearchResult>result;
      __requestList = temp.requestList;
      this.requestList = __requestList;
      this.totalRecords = temp.totalSize;
      this.showRequestList();

      this.filteredRegisterStartDate = this.requestSearch.registerTimeStart;
      this.filteredRegisterStopDate = this.requestSearch.registerTimeEnd;
      this.selectedFilter.f_registerTime = true;

      let registerTime: string = this.filteredRegisterStartDate + " " + this.filteredRegisterStopDate;
      this.chipsFilterMap.set(this.shared.registerPeriodTimeLabel + " : " + registerTime, "f_registerTime");
      this.chipsFilterValues.push(this.shared.registerPeriodTimeLabel + " : " + registerTime);


    }, error => {
      //console.log(error);
      this.loading = false;
      let obj: RequestSearchResult = error.error;
      let err: BackendMessage = obj.error;
      this.parseError(error.status, err);
      this.dataTableLoading = false;
    });
  }

  rtvYesterdayList() {
    let __requestList = [...this.requestList];
    this.loading = true;
    this.dataTableLoading = true;
    this.requestSearch.sortById = 6;
    this.requestSearch.sortOrderId = 2;


    let yesterdayStart = moment().subtract(1, 'days').startOf('day');
    let yesterdayEnd = moment().subtract(1, 'days').endOf('day');

    this.requestSearch.registerTimeStart = moment(yesterdayStart).locale('fa').format('YYYY/MM/DD HH:mm:ss');
    this.requestSearch.registerTimeEnd = moment(yesterdayEnd).locale('fa').format('YYYY/MM/DD HH:mm:ss');
    this.requestSearch.f_registerTime = true;

    this.requestMgmService.search(this.requestSearch).subscribe(result => {
      this.dataTableLoading = false;
      this.loading = false;
      let temp: RequestSearchResult = <RequestSearchResult>result;
      __requestList = temp.requestList;
      this.requestList = __requestList;
      this.totalRecords = temp.totalSize;
      this.showRequestList();

      this.filteredRegisterStartDate = this.requestSearch.registerTimeStart;
      this.filteredRegisterStopDate = this.requestSearch.registerTimeEnd;
      this.selectedFilter.f_registerTime = true;

      let registerTime: string = this.filteredRegisterStartDate + " " + this.filteredRegisterStopDate;
      this.chipsFilterMap.set(this.shared.registerPeriodTimeLabel + " : " + registerTime, "f_registerTime");
      this.chipsFilterValues.push(this.shared.registerPeriodTimeLabel + " : " + registerTime);


    }, error => {
      //console.log(error);
      this.loading = false;
      let obj: RequestSearchResult = error.error;
      let err: BackendMessage = obj.error;
      this.parseError(error.status, err);
      this.dataTableLoading = false;
    });
  }

  calculateColSpan() {
    this.colspan_control = 0;
    if (this.permGoBackFlag)
      this.colspan_control++;
    if (this.permCloseFlag)
      this.colspan_control++;
    if (this.permCancelFlag)
      this.colspan_control++;
  }

  initCurrentStatesRequestSearch(): RequestSearch {
    let requestSearch = new RequestSearch();
    requestSearch.f_stateId = true;
    requestSearch.stateIdList.push(RequestStateEnum.waitToOffer);
    requestSearch.stateIdList.push(RequestStateEnum.offerTimeFinished);
    requestSearch.stateIdList.push(RequestStateEnum.Wait4DoAck);
    requestSearch.stateIdList.push(RequestStateEnum.ongoing);
    requestSearch.stateIdList.push(RequestStateEnum.waitToPayment);
    requestSearch.stateIdList.push(RequestStateEnum.waitToPoll);
    return requestSearch;
  }

  initReqSearch(requsetStateID: number) {
    let requestSearch = new RequestSearch();
    requestSearch.f_stateId = true;
    requestSearch.stateIdList.push(requsetStateID);
    return requestSearch;
  }

  rtvReqState(requsetStateID: number, requestStateLabel: string) {
    let request = new RequestState();
    request.id = requsetStateID;
    request.name = requestStateLabel;
    return request;
  }

  showSMSPanel(mobileNumber: string) {
    if (!this.sensSMSCapable)
      this.hmsgs.push({ severity: 'error', summary: '', detail: this.shared.restrictedAccess });
    this.filteredSMSList = [];
    let sms: Sms = new Sms();
    sms.mobileNumber = mobileNumber;
    this.filteredSMSList.push(sms);
    this.displaySMSPanel = true;
  }
}
