import { ErrorV } from './../../entities/errorV.class';
import { WorkerPaymentReport } from './../../entities/workerPaymentReport.class';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GrowlMessage } from '../../entities/growlMessage.class';
import { SharedValues } from '../../services/shared-values.service';
import { FinancialReportService } from '../../services/financialReport.service';
import { BackendMessage } from '../../entities/Msg.class';
import { HandleErrorMsg } from '../../shared/handleError.class';
import { Router } from '@angular/router';
import { TransactionV } from '../../entities/transactionV.class';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BasicData } from './../../entities/basicData.class';
import * as moment from 'jalali-moment';
import { Moment } from 'jalali-moment';
import { SharedDataService } from 'app/services/sharedData.service';
import { PrintService } from 'app/services/print.service';

@Component({
  selector: 'app-wr-payment-report',
  templateUrl: './wr-payment-report.component.html',
  providers: [FinancialReportService],
  styleUrls: ['../../../assets/css/dashboard.css']

})
export class WrPaymentReportComponent implements OnInit,AfterViewInit {
  hmsgs: GrowlMessage[] = [];
  loading: boolean = false;
  activeLabel: string = this.shared.wrPaymentReport;
  wrPaymentReportItems: WorkerPaymentReport[] = [];
  errorCntrler: HandleErrorMsg;
  displayTransactionView: boolean = false;
  selectedTransactionList: TransactionV[] = [];
  selectedPaymentReport:WorkerPaymentReport;
  selectedReportDate: string = "";
  reportForm: FormGroup;
  transactionListHeader: string;
  loadingDialog = false;
  displayRegisterDialog: boolean = false;
  selectedWorkerID: number;
  selectedTransactionAmount: number;
  basicData: BasicData;
  displayWorkerView: boolean = false;
  displayImageDialog = false;
  selectedImagePath: string = "";
  selectedWorkerFullName: string = "";
  datePickerConfig = {
    drops: 'down',
    format: 'YYYY-MM-DD',
    appendTo:'body'
  };
  _reportFilterDate : Moment;
  constructor(private _router: Router,
    public shared: SharedValues,
    private _fb: FormBuilder,
    private dataService: SharedDataService,
    public printService:PrintService,
    public financialReportService: FinancialReportService) {
    this.errorCntrler = new HandleErrorMsg(_router)
  }

  ngOnInit() {
    this.reportForm = this._fb.group({
      reportDateFormCntrl: ['']
    });
    this.basicData = JSON.parse(localStorage.getItem('basicData'));


  }
  ngAfterViewInit() {
    
  }
  // setupDateComponents() {
  //   Calendar.setup({
  //     inputField: "reportFilterDate_input",
  //     button: "reportFilter_btn",
  //     ifFormat: "%Y-%m-%d",
  //     showsTime: false,
  //     dateType: 'jalali',
  //     weekNumbers: false
  //   });

  // }
  onSubmitFilterform() {
    if(this._reportFilterDate!=undefined)
        this.selectedReportDate =  moment(this._reportFilterDate).locale('fa').format('YYYY-MM-DD');
    this.refreshList();
  }
  refreshList() {
    if (this.selectedReportDate == '') {
      this.hmsgs.push({ severity: 'error', summary: '', detail: this.shared.InnerCode_InvalidTimeMsg });
      return;
    }

    this.loading = true;

    this.financialReportService.getPaymentReport(this.selectedReportDate).subscribe(result => {
      this.wrPaymentReportItems = <WorkerPaymentReport[]>result;
      this.loading = false;

    }, error => {
      let err: ErrorV = <ErrorV>error.error.error;
      this.parseError(error.status, err);

      this.loading = false;
    });
  }
  showTransactionDetail(paymentReport: WorkerPaymentReport) {
    this.selectedPaymentReport = paymentReport;
    this.selectedTransactionList = paymentReport.transactions;
    this.dataService.selectedTransactionList = this.selectedTransactionList;
    this.transactionListHeader = this.shared.showTransactionList + " " + paymentReport.firstName + " " + paymentReport.lastName;
    this.dataService.transactionListHeader = this.transactionListHeader;
    this.displayTransactionView = true;

  }
  onPrintInvoice() {
    this.printService
      .printDocument('workerPaymentPrintView');
  }
  closeTransactionDetail(){
    this.displayTransactionView = false;
  }
  showRegisterDialog(paymentReport: WorkerPaymentReport) {
    this.selectedWorkerID = paymentReport.id;
    this.selectedTransactionAmount = paymentReport.payableAmount;
    this.displayRegisterDialog = true;
  }

  showWorkerViewDialog(paymentReport: WorkerPaymentReport) {
    this.selectedWorkerID = paymentReport.id;
    this.selectedWorkerFullName = paymentReport.firstName + " " + paymentReport.lastName;
    this.displayWorkerView = true;
  }
  onShowImage(event) {
    this.displayImageDialog = true;
    this.selectedImagePath = event;
  }
  closeViewDialog() {
    this.displayWorkerView = false;
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
