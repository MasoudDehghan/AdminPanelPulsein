import { AccountantDocumentRegister } from './../../entities/accountantDocumentRegister.class';
import { ValueAddedAggregatedDetail } from './../../entities/valueAddedAggregatedDetail.class';
import { ValueAddedAggregatedInfo } from './../../entities/valueAddedAggregatedInfo.class';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValueAddedReportRequest } from 'app/entities/valueAddedReportRequest.class';
import { ExcelService } from 'app/services/excel.service';
import * as moment from 'jalali-moment';
import { Moment } from 'jalali-moment';
import { DataTable } from 'primeng/primeng';
import { BackendMessage } from '../../entities/Msg.class';
import { HandleErrorMsg } from '../../shared/handleError.class';
import { BasicData } from './../../entities/basicData.class';
import { GrowlMessage } from './../../entities/growlMessage.class';
import { ValueAddedInfo } from './../../entities/valueAddedInfo.class';
import { ValueAddedReportResult } from './../../entities/valueAddedReportResult.class';
import { FinancialReportService } from './../../services/financialReport.service';
import { PrintService } from './../../services/print.service';
import { SharedValues } from './../../services/shared-values.service';
import { SharedDataService } from './../../services/sharedData.service';
import { ValueAddedReportAggregated } from 'app/entities/valueAddedReportAggregated.class';
import { ValueAddedReportSimple } from 'app/entities/valueAddedReportSimple.class';


@Component({
  selector: 'app-valueAdded-report',
  templateUrl: './valueAddred-report.component.html',
  styleUrls: ['./valueAddred-report.component.css'],
  providers: [FinancialReportService, ExcelService]
})
export class ValueAddredReportComponent implements OnInit {
  activeLabel = this.shared.valueAddredReportLabel;
  hmsgs: GrowlMessage[] = [];
  loading = false;
  totalRecords: number;
  errorCntrler: HandleErrorMsg;
  basicData: BasicData;

  reportResult: ValueAddedInfo[];
  reportResultSum: ValueAddedInfo;

  reportResultAggregated: ValueAddedAggregatedInfo[];
  reportResultAggregatedSum: ValueAddedAggregatedDetail;

  selectedValueAddedInfo: ValueAddedInfo;
  selectedAggregatedValueAddedInfo: ValueAddedAggregatedInfo;

  reportRequest: ValueAddedReportRequest = new ValueAddedReportRequest();

  dataTableLoading: boolean = false;
  defaultPageSize = 8;
  loadingDialog = false;
  selectedWorkerFullName: string = "";
  selectedWorkerID: number;
  displayDetail = false;
  displayAggregatedDetail = false;
  datePickerConfig = {
    drops: 'down',
    format: 'YYYY/MM/DD',
    appendTo: 'body'
  };
  reportStartDate: Moment;
  reportStopDate: Moment;
  selectedReportTimeStart: string;
  selectedReportTimeStop: string;
  aggregateReport: boolean = false;
  filterForm: FormGroup;
  @ViewChild('idt') public dataTable: DataTable;
  @ViewChild('adt') public dataTableAggregated: DataTable;
  registerForm: FormGroup;
  selectedAccountNumber: string = "";
  displayRegisterDialog = false;
  _registerDate: Moment;
  selectedRegisterDate: string;
  constructor(private _router: Router,
    public shared: SharedValues,
    public printService: PrintService,
    private dataService: SharedDataService,
    private excelService: ExcelService,
    private _fb: FormBuilder,
    public financialReportService: FinancialReportService) { }

  ngOnInit() {
    this.errorCntrler = new HandleErrorMsg(this._router);
    this.basicData = JSON.parse(localStorage.getItem('basicData'));

    this.filterForm = this._fb.group({
      reportTimeStart: [''],
      reportTimeEnd: [''],
      aggregate: [false]

    });
    this.registerForm = this._fb.group({
      accountNumber: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(40)])],
      registerDate: ['']
    });
  }

  onSubmitFilterform() {
    try {

      if (this.reportStartDate != undefined)
        this.selectedReportTimeStart = moment(this.reportStartDate).locale('fa').format('YYYY/MM/DD');
      if (this.reportStopDate != undefined)
        this.selectedReportTimeStop = moment(this.reportStopDate).locale('fa').format('YYYY/MM/DD');



      if (this.selectedReportTimeStart != null && this.selectedReportTimeStop != null) {
        if (this.selectedReportTimeStart != "" && this.selectedReportTimeStop != "") {
          this.reportRequest.startTime = this.selectedReportTimeStart;
          this.reportRequest.endTime = this.selectedReportTimeStop;
        }
      }
      this.reportRequest.aggregate = this.aggregateReport;

      this.rtvData(this.reportRequest);


    }
    catch (e) {
      console.log(e);
    }
  }

  rtvData(req: ValueAddedReportRequest) {
    
    this.selectedAggregatedValueAddedInfo = null;
    this.selectedValueAddedInfo = null;
    this.reportResult = null;
    this.reportResultAggregated = null;
    this.loading = true;
    this.dataTableLoading = true;
    this.financialReportService.getValueAddedReport(req).subscribe(result => {
      this.dataTableLoading = false;
      this.loading = false;
      let temp: ValueAddedReportResult = <ValueAddedReportResult>result;
      let reportResultTemp;
      if (req.aggregate) {
        reportResultTemp = <ValueAddedReportAggregated>temp.aggregatedResult;
        reportResultTemp.dataList.map((element) => {
          element.workerName = element.workerFirstName + " " + element.workerLastName;
          element.printable = element.registered;
          let noAccountNumberItems =  element.items.find(x => x.accountantNumber == null);
          if(noAccountNumberItems)
            element.printable = false;          
          return element;
        });
        this.reportResultAggregated = reportResultTemp.dataList;
        this.reportResultAggregatedSum = reportResultTemp.sum;
        this.totalRecords = this.reportResultAggregated.length;
      }
      else {
        reportResultTemp = <ValueAddedReportSimple>temp.simpleResult;
        reportResultTemp.dataList.map((element) => {
          element.clientName = element.clientFirstName + " " + element.clientLastName;
          element.workerName = element.workerFirstName + " " + element.workerLastName;
          element.printable = element.registered ;
          return element;
        });
        this.reportResult = reportResultTemp.dataList;
        this.reportResultSum = reportResultTemp.sum;
        this.totalRecords = this.reportResult.length;
      }
    }, error => {
      this.loading = false;
      console.log(error);
      let err: BackendMessage = error.error.error;
      this.parseError(error.status, err);
      this.dataTableLoading = false;
    });
  }


  showDetail(v: ValueAddedInfo) {
    this.displayDetail = true;
    this.selectedValueAddedInfo = v;
    this.dataService.valueAddedInfo = v;
    this.dataService.aggregatedValueAddedInfo = null;
  }
  showAggregatedDetail(v: ValueAddedAggregatedInfo) {
    this.displayAggregatedDetail = true;
    this.selectedAggregatedValueAddedInfo = v;
    this.dataService.aggregatedValueAddedInfo = v;
    this.dataService.valueAddedInfo = null;

  }
  closeDetail() {
    this.displayDetail = false;
  }
  closeAggregatedDetail() {
    this.displayAggregatedDetail = false;
  }
  onPrintBill() {
    this.printService
      .printDocument('valueAddedPrintView');
  }

  exportExcel() {
    let filteredList: ValueAddedInfo[] = [];
    if (this.dataTable.filteredValue != undefined) {
      this.dataTable.filteredValue.forEach(element => {
        let entity = <ValueAddedInfo>element;
        filteredList.push(entity);
      });
    }
    else {
      this.reportResult.forEach(element => {
        let entity = <ValueAddedInfo>element;
        filteredList.push(entity);
      });
    }

    this.excelService.exportAsExcelFile(filteredList, 'filteredAccountantReports');
  }
  exportAggregatedExcel() {
    let filteredList: ValueAddedAggregatedInfo[] = [];
    if (this.dataTableAggregated.filteredValue != undefined) {
      this.dataTableAggregated.filteredValue.forEach(element => {
        let entity = <ValueAddedAggregatedInfo>element;
        filteredList.push(entity);
      });
    }
    else {
      this.reportResultAggregated.forEach(element => {
        let entity = <ValueAddedAggregatedInfo>element;
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
  showRegisterDialog(data: ValueAddedInfo) {
    this.selectedValueAddedInfo = data;
    this.selectedAccountNumber = "";
    this.displayRegisterDialog = true;
  }
  showAggregatedRegisterDialog(data: ValueAddedAggregatedInfo) {
    this.selectedAggregatedValueAddedInfo = data;
    this.selectedAccountNumber = "";
    this.displayRegisterDialog = true;
  }
  closeRegisterPanel() {
    this.displayRegisterDialog = false;
  }
  onSubmmitRegisterForm() {
    let accountantDocumentRegister: AccountantDocumentRegister = new AccountantDocumentRegister();
    accountantDocumentRegister.idList = [];

    if (this._registerDate)
      this.selectedRegisterDate = moment(this._registerDate).locale('fa').format('YYYY/MM/D');
    else {
      this.hmsgs.push({ severity: 'error', summary: '', detail: this.shared.InnerCode_InvalidTimeMsg });
      return;
    }
    if (this.selectedAccountNumber != null) {
      if (this.selectedAccountNumber != '') {
        accountantDocumentRegister.accountantNumber = this.selectedAccountNumber.replace(' ', '').trim();
      }
    } else {
      this.hmsgs.push({ severity: 'error', summary: '', detail: this.shared.InnerCode_InvalidAccountantNumberMsg });
      return;
    }
    accountantDocumentRegister.registerTime = this.selectedRegisterDate;
    if (this.selectedValueAddedInfo) {
      accountantDocumentRegister.idList.push(this.selectedValueAddedInfo.id);
    }
    else if (this.selectedAggregatedValueAddedInfo) {
      this.selectedAggregatedValueAddedInfo.items.forEach(item=>{
        accountantDocumentRegister.idList.push(item.id);
      })
    }

    this.financialReportService.registerAccountantNumber(accountantDocumentRegister).subscribe(result => {
      if (this.selectedValueAddedInfo) {
        let __list = [...this.reportResult];
        let _index = this.findIndex(this.selectedValueAddedInfo);
        this.selectedValueAddedInfo.accountantNumber = this.selectedAccountNumber;
        this.selectedValueAddedInfo.registered = true;
        this.selectedValueAddedInfo.printable = true;
        __list[_index] = this.selectedValueAddedInfo;
        this.reportResult = __list;
      }
      else if (this.selectedAggregatedValueAddedInfo){
        let __list = [...this.reportResultAggregated];
        let _index = this.findAIndex(this.selectedAggregatedValueAddedInfo);
        this.selectedAggregatedValueAddedInfo.accountantNumber = this.selectedAccountNumber;
        this.selectedAggregatedValueAddedInfo.registered = true;
        this.selectedAggregatedValueAddedInfo.printable = true;
        this.selectedAggregatedValueAddedInfo.items.map((element)=>{
          element.accountantNumber = this.selectedAccountNumber;
          return element;
        });
        __list[_index] = this.selectedAggregatedValueAddedInfo;
        this.reportResultAggregated = __list;
      }
      this.displayRegisterDialog = false;
    },
      error => {
        this.loading = false;
        let err: BackendMessage = error.error.error;
        this.parseError(error.status, err);
      });


  }

  test() {
    console.log("ssssssssssssssssssstart")
    this.selectedReportTimeStart = "1399/02/01";
    this.selectedReportTimeStop = "1399/05/03";
    this.aggregateReport = true;
    //this.onSubmitFilterform();
  }
  findIndex(data: ValueAddedInfo) {
    for (let i = 0; i < this.reportResult.length; i++) {
      let element: ValueAddedInfo = this.reportResult[i];
      if (element.id == data.id)
        return i;
    }
  }
  findAIndex(data: ValueAddedAggregatedInfo) {
    for (let i = 0; i < this.reportResultAggregated.length; i++) {
      let element: ValueAddedAggregatedInfo = this.reportResultAggregated[i];
      if (element.workerId == data.workerId)
        return i;
    }
  }
}

export class ProductInfoView {
  index: number;
  name: string;
  user: string;
  code: string;
  count: number;
  unit: string;
  commision: number;
  tax: number;
  total: number;
  noAccountNumber:boolean;
  accountantNumber:string;
}