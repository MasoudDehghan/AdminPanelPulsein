import { TransactionType } from './../../entities/transactionType.class';
import { User } from './../../entities/user.class';
import { TransactionSearchResult } from './../../pEntites/transactionSearchResult.class';
import { FinancialMgmService } from './../../services/financialMgm.service';
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { SharedValues } from '../../services/shared-values.service'
import { BackendMessage } from '../../entities/Msg.class'
import { HandleErrorMsg } from '../../shared/handleError.class'
import { GrowlMessage } from '../../entities/growlMessage.class'
import { TransactionFilterSearchResult } from '../../entities/trSearchResult.class';
import { TransactionSearch } from './../../pEntites/transactionSearch.class';
import * as moment from 'jalali-moment';
import { Moment } from 'jalali-moment';

@Component({
  selector: 'app-transaction-filter',
  templateUrl: './transaction-filter.component.html',
  styleUrls: ['./transaction-filter.component.css'],
  providers:[FinancialMgmService]
})
export class TransactionFilterComponent implements OnInit {
  filterForm: FormGroup;
  selectedFilter: TransactionSearch = new TransactionSearch();
  loading = false;

  @Input() selectedTransactionAmountRange: number[] = [];
  @Input() selectedRegisterStartDate: string = null;
  @Input() selectedRegisterStopDate: string = null;
  @Input() selectedPaymentMethodID: number;
  @Input() selectedTrackingCode : string = null
  //0:NotSelected,1:Cache,2:Credit
  @Input() selectedPaymentTypeID: TransactionType = null;
  @Input() selectedReferenceUserID : User = null
  @Input() selectedFirstName: string = null;
  @Input() selectedLastName: string = null;
  @Input() systemUsersList: SelectItem[] = [];
  @Input() transactionTypeList: SelectItem[] = [];

  @Output() onClose = new EventEmitter<boolean>();
  @Output() onSearch = new EventEmitter<TransactionFilterSearchResult>();
  
  errorCntrler: HandleErrorMsg;
  msgs: GrowlMessage[] = [];

  datePickerConfig = {
    drops: 'down',
    format: 'YYYY/MM/DD HH:mm:ss',
    appendTo:'body'
  };
  _registerStartDate: Moment;
  _registerStopDate: Moment;
  constructor(private _router: Router, private _fb: FormBuilder,
    public transactionMgmService: FinancialMgmService,
    public shared: SharedValues) { }

  ngOnInit() {
    this.filterForm = this._fb.group({
      transactionAmountRangeFormCntrl: [''],
      transactionAmountActiveFormCntrl: [''],
      registerStartDate: [''],
      registerStopDate: [''],
      PaymentMethodFormCntrl: [''],
      trackingCodeFormCntrl: [''],
      PaymentTypeFormCntrl: [''],
      ReferenceUserFormCntrl: [''],
      personalData: new FormGroup({
        firstName: new FormControl(['']),
        lastName: new FormControl([''])
       })
    });

    this.errorCntrler = new HandleErrorMsg(this._router);

    if (this.selectedTransactionAmountRange = []) {
      this.selectedTransactionAmountRange[0] = 0;
      this.selectedTransactionAmountRange[1] = 1000000;
    }
  }

  ngAfterViewInit() {
    
  }
 
  onSubmitFilterform() {
    try {
      if(this._registerStartDate!=undefined)
        this.selectedRegisterStartDate = moment(this._registerStartDate).locale('fa').format('YYYY/MM/DD HH:mm:ss');
      if(this._registerStopDate!=undefined)
        this.selectedRegisterStopDate = moment(this._registerStopDate).locale('fa').format('YYYY/MM/DD HH:mm:ss');

        if (this.selectedFilter.f_amount) {
          if (this.selectedTransactionAmountRange.length == 2) {
            this.selectedFilter.amountMin = this.selectedTransactionAmountRange[0];
            this.selectedFilter.amountMax = this.selectedTransactionAmountRange[1];
          }
        }
        if (this.selectedRegisterStartDate != null && this.selectedRegisterStopDate != null) {
          if (this.selectedRegisterStartDate != "" && this.selectedRegisterStopDate != "") {
            this.selectedFilter.registerTimeStart = this.selectedRegisterStartDate;
            this.selectedFilter.registerTimeEnd = this.selectedRegisterStopDate;
            this.selectedFilter.f_registerTime = true;
          }
        }
      if (this.selectedPaymentMethodID != null) {
        if (this.selectedPaymentMethodID != 0) {
          if(this.selectedPaymentMethodID ==1 ){
            this.selectedFilter.cash = true;
            this.selectedFilter.f_cash = true;
          }
          else if(this.selectedPaymentMethodID ==2 ){
            this.selectedFilter.cash = false;
            this.selectedFilter.f_cash = true;
          }
        }
      }
      if (this.selectedTrackingCode != null) {
        if (this.selectedTrackingCode != '') {
          this.selectedFilter.trackingCode = this.selectedTrackingCode.replace(' ', '');
          this.selectedFilter.trackingCode = this.selectedFilter.trackingCode.trim();
          this.selectedFilter.f_trackingCode = true;
        }
      }
      if (this.selectedPaymentTypeID != null) {
          this.selectedFilter.typeId = this.selectedPaymentTypeID.id;
          this.selectedFilter.f_typeId = true;
      }
      if (this.selectedReferenceUserID != null) {
          this.selectedFilter.refUserId = this.selectedReferenceUserID.id;
          this.selectedFilter.f_refUserId = true;      
      }
   
      if (this.selectedFirstName != null) {
        if (this.selectedFirstName != '') {
          this.selectedFilter.userFirstName = this.selectedFirstName
          this.selectedFilter.f_userFirstName = true;
        }
      }

      if (this.selectedLastName != null) {
        if (this.selectedLastName != '') {
          this.selectedFilter.userLastName = this.selectedLastName
          this.selectedFilter.f_userLastName = true;
        }
      }
      this.loading = true;
      this.transactionMgmService.search(this.selectedFilter).subscribe(response => {

        let out: TransactionFilterSearchResult = new TransactionFilterSearchResult();

        let transactionSeacrhResult: TransactionSearchResult = <TransactionSearchResult>response;
        out.transactions = transactionSeacrhResult.transactionList;
        out.totalSize = transactionSeacrhResult.totalSize;
        out.transactionSearch= this.selectedFilter;
        out.selectedRegisterStartDate = this.selectedRegisterStartDate;
        out.selectedRegisterStopDate = this.selectedRegisterStopDate;
        out.selectedAmountMin = this.selectedFilter.amountMin;
        out.selectedAmountMax = this.selectedFilter.amountMax;
        out.selectedTransactionAmountRange = this.selectedTransactionAmountRange
        if(this.selectedFilter.f_cash){
          if(this.selectedFilter.cash)
            out.selectedPaymentMethod = 1;            
          else
            out.selectedPaymentMethod = 2;
        }
        out.selectedTrackingCode = this.selectedTrackingCode;
        out.selectedPaymentType = this.selectedPaymentTypeID;
        out.selectedReferenceUser = this.selectedReferenceUserID;
        out.selectedFirstName = this.selectedFirstName;
        out.selectedLastName = this.selectedLastName;
        out.selectedRegisterStartDate = this.selectedRegisterStartDate;
        out.selectedRegisterStopDate = this.selectedRegisterStopDate;
        this.onSearch.emit(out);
        this.loading = false;
      }, error => {
        let obj: TransactionSearchResult = error.error;
        let err: BackendMessage = obj.error;
        this.parseError(error.status, err);
        this.loading = false;
      });

    }
    catch (e) {
      console.log(e);
    }
  }
  
  parseError(status: any, err: any) {
    this.errorCntrler.gMessage = [];
    this.msgs = [];
    let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(status, err);
    let errorMessages = this.errorCntrler.gMessage;
    errorMessages.forEach(element => {
      this.msgs.push(element);
    });
  }
}
