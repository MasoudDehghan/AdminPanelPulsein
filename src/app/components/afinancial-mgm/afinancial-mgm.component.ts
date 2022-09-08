import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExcelService } from 'app/services/excel.service';
import * as moment from 'jalali-moment';
import { Moment } from 'jalali-moment';
import { DataTable } from 'primeng/primeng';
import { BackendMessage } from '../../entities/Msg.class';
import { HandleErrorMsg } from '../../shared/handleError.class';
import { AccountantDocumentRegister } from './../../entities/accountantDocumentRegister.class';
import { AccountantReport } from './../../entities/accountantReport.class';
import { AccountantReportRequest } from './../../entities/accountantReportRequest.class';
import { AccountantReportResult } from './../../entities/accountantReportResult.class';
import { ArWorkerInfo } from './../../entities/arWorkerInfo.class';
import { BasicData } from './../../entities/basicData.class';
import { GrowlMessage } from './../../entities/growlMessage.class';
import { FinancialReportService } from './../../services/financialReport.service';
import { SharedValues } from './../../services/shared-values.service';


@Component({
  selector: 'app-afinancial-mgm',
  templateUrl: './afinancial-mgm.component.html',
  styleUrls: ['./afinancial-mgm.component.css'],
  providers: [FinancialReportService,ExcelService]
})
export class AFinancialMgmComponent implements OnInit {
  activeLabel = this.shared.menuItem6SubItem4Label;
  hmsgs: GrowlMessage[] = [];
  loading = false;
  totalRecords: number ;
  errorCntrler: HandleErrorMsg;
  basicData: BasicData;

  displayWorkerList = false;
  displayTransactionView = false;
  

  accountantReportResult: AccountantReportResult;
  selectedWorkerAccountantReports: AccountantReport[] = [];
  selectedWorkerAccountantReport:AccountantReport = new AccountantReport();
  accountantReportRequest: AccountantReportRequest = new AccountantReportRequest();

  dataTableLoading: boolean = false;
  defaultPageSize = 8;
  loadingDialog = false;
  selectedWorkerFullName: string = "";
  selectedWorkerID: number;


  datePickerConfig = {
    drops: 'down',
    format: 'YYYY/MM/DD HH:mm:ss',
    appendTo: 'body'
  };
  reportStartDate: Moment;
  reportStopDate: Moment;
  selectedReportTimeStart:string;
  selectedReportTimeStop:string;
  selectedCode:string;
  selectedFirstName:string;
  selectedLastName:string;
  available:boolean = true;
  transactionListHeader:string = "";
  filterForm: FormGroup;
  
  
  @ViewChild('idt') public dataTable: DataTable;
  
  constructor(private _router: Router,
    public shared: SharedValues,
    private excelService: ExcelService,
    private _fb: FormBuilder,
    public financialReportService: FinancialReportService) { }

  ngOnInit() {
    this.errorCntrler = new HandleErrorMsg(this._router);
    this.basicData = JSON.parse(localStorage.getItem('basicData'));

    this.filterForm = this._fb.group({
      code: [''],
      reportTimeStart: [''],
      reportTimeEnd: [''],
      available: [],
      firstName: [''],
      lastName: ['']
    });


  }

  onSubmitFilterform() {
    try {
      let accountantReportRequest = new AccountantReportRequest();
      if (this.reportStartDate != undefined)
        this.selectedReportTimeStart = moment(this.reportStartDate).locale('fa').format('YYYY/MM/DD HH:mm:ss');
      if (this.reportStopDate != undefined)
        this.selectedReportTimeStop = moment(this.reportStopDate).locale('fa').format('YYYY/MM/DD HH:mm:ss');

      if (this.selectedCode != null) {
        if (this.selectedCode != '') {
          accountantReportRequest.workerCode = this.selectedCode.replace(' ', '').trim();
        }
      }
      if (this.selectedFirstName != null) {
        if (this.selectedFirstName != '') {
          accountantReportRequest.firstName = this.selectedFirstName.replace(' ', '').trim();
        }
      }
      if (this.selectedLastName != null) {
        if (this.selectedLastName != '') {
          accountantReportRequest.lastName = this.selectedLastName.replace(' ', '').trim();
        }
      }

      if (this.selectedReportTimeStart != null && this.selectedReportTimeStop != null) {
        if (this.selectedReportTimeStart != "" && this.selectedReportTimeStop != "") {
          accountantReportRequest.startTime = this.selectedReportTimeStart;
          accountantReportRequest.endTime = this.selectedReportTimeStop;
        }
      }
      if (this.available != null) {
        if (this.available != undefined) {
          accountantReportRequest.allAvailable = this.available;
        }
      }
      
      this.rtvData(accountantReportRequest);
     

    }
    catch (e) {
      console.log(e);
    }
  }

  rtvData(accountantReportRequest:AccountantReportRequest) {
    console.log(accountantReportRequest);
    let __accountantReportResult:AccountantReportResult = new AccountantReportResult();

    this.loading = true;
    this.dataTableLoading = true;
    this.financialReportService.getAccountantReport(accountantReportRequest).subscribe(result => {
      this.dataTableLoading = false;
      this.loading = false;
      let temp: AccountantReportResult = <AccountantReportResult>result;
      __accountantReportResult = temp;
      this.accountantReportResult = __accountantReportResult;
      this.totalRecords = temp.workers.length;
      this.displayWorkerList = true;
    }, error => {
      this.loading = false;
      let obj: AccountantReportResult = error.error;
      let err: BackendMessage = obj.error;
      this.parseError(error.status, err);
      this.dataTableLoading = false;
    });
  }
  
 
  
  showTransactionList() {
    this.displayWorkerList = true;
    
  }
 
  showTransactiontDetail(worker: ArWorkerInfo) {
    let userID = worker.userId;
    this.loadingDialog = true;
    this.displayTransactionView = true;
    let accountantReportRequest  = new AccountantReportRequest();
    accountantReportRequest.userId = userID
    if (this.selectedReportTimeStart != null && this.selectedReportTimeStop != null) {
      if (this.selectedReportTimeStart != "" && this.selectedReportTimeStop != "") {
        accountantReportRequest.startTime = this.selectedReportTimeStart;
        accountantReportRequest.endTime = this.selectedReportTimeStop;
      }
    }
    this.loading = true;
    this.dataTableLoading = true;
    this.financialReportService.getAccountantReport(accountantReportRequest).subscribe(result => {
      this.dataTableLoading = false;
      this.loading = false;
      let temp: AccountantReportResult = <AccountantReportResult>result;
      let reports:AccountantReport[] = temp.dataList;
      this.selectedWorkerAccountantReports = reports;
      this.transactionListHeader = this.shared.transactionListLabel+" "+temp.workers[0].firstName+" " +temp.workers[0].lastName;
      this.displayTransactionView = true;
    }, error => {
      this.loading = false;
      let obj: AccountantReportResult = error.error;
      let err: BackendMessage = obj.error;
      this.parseError(error.status, err);
      this.dataTableLoading = false;
    });

  }
  closeTransactionDetail(){
    this.displayTransactionView = false;
  }
  

  exportExcel() {
    let filteredList: AccountantReport[] = [];
    if (this.dataTable.filteredValue != undefined) {
        this.dataTable.filteredValue.forEach(element => {
            let entity = <AccountantReport>element;
            filteredList.push(entity);
        });
    }
    else {
        this.selectedWorkerAccountantReports.forEach(element => {
            let entity = <AccountantReport>element;
            filteredList.push(entity);
        });
    }

    this.excelService.exportAsExcelFile(filteredList, 'filteredAccountantReports');
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