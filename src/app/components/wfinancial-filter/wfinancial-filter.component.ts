import { SelectItem } from 'primeng/primeng';
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms'
import { Router } from '@angular/router';
import { SharedValues } from '../../services/shared-values.service'
import { BackendMessage } from '../../entities/Msg.class'
import { HandleErrorMsg } from '../../shared/handleError.class'
import { GrowlMessage } from '../../entities/growlMessage.class'
import { WFinancialFilterSearchResult } from 'app/pEntites/lastCreditSearchResultFilter.class';
import { LastCreditSearchResult } from './../../pEntites/lastCreditSearchResult.class';
import { LastCreditSearch } from './../../pEntites/lastCreditSearch.class';
import { FinancialMgmService } from './../../services/financialMgm.service';
import * as moment from 'jalali-moment';
import { Moment } from 'jalali-moment';
import { CreditSearchEnum } from 'app/enums/creditSearch.enum';
import { SortOrder } from 'app/enums/sortOrder.enum';

@Component({
  selector: 'app-wfinancial-filter',
  templateUrl: './wfinancial-filter.component.html',
  providers: [FinancialMgmService],
  styleUrls: ['./wfinancial-filter.component.css']
})
export class WFinancialFilterComponent implements OnInit {
  filterForm: FormGroup;
  selectedFilter: LastCreditSearch = new LastCreditSearch();
  loading = false;

  @Input() selectedTransactionAmountStart: number = 0;
  @Input() selectedTransactionAmountStop: number = 0;
  @Input() selectedUpdateStartDate: string = null;
  @Input() selectedUpdateStopDate: string = null;
  @Input() selectedFirstName: string = null;
  @Input() selectedLastName: string = null;
  @Input() selectedCode: string = null;
  @Input() selectedRegisterState: number = -1;
  @Input() registerStateList:SelectItem[] = [];
  @Output() onClose = new EventEmitter<boolean>();
  @Output() onSearch = new EventEmitter<WFinancialFilterSearchResult>();

  errorCntrler: HandleErrorMsg;
  msgs: GrowlMessage[] = [];

  datePickerConfig = {
    drops: 'down',
    format: 'YYYY/MM/DD HH:mm:ss',
    appendTo:'body'
  };
  _updateStartDate : Moment;
  _updateStopDate : Moment;


  constructor(private _router: Router, private _fb: FormBuilder,
    public transactionMgmService: FinancialMgmService,
    public shared: SharedValues) { }

  ngOnInit() {
    this.filterForm = this._fb.group({
      transactionAmountStartFormCntrl: [''],
      transactionAmountStopFormCntrl: [''],
      updateStartDate: [''],
      updateStopDate: [''],
      personalData: new FormGroup({
        firstName: new FormControl(['']),
        lastName: new FormControl(['']),
        code: new FormControl(['']),
        state: new FormControl([''])
      })
    });

    this.errorCntrler = new HandleErrorMsg(this._router);
    this.selectedFilter.workerSearch = true;
    this.selectedFilter.sortById = CreditSearchEnum.updateTime;
    this.selectedFilter.sortOrderId = SortOrder.desc;

  }

 
  onSubmitFilterform() {
    try {
      if(this._updateStartDate!=undefined)
        this.selectedUpdateStartDate = moment(this._updateStartDate).locale('fa').format('YYYY/MM/DD HH:mm:ss'); 
      if(this._updateStopDate!=undefined)
        this.selectedUpdateStopDate = moment(this._updateStopDate).locale('fa').format('YYYY/MM/DD HH:mm:ss'); 
      if (this.selectedTransactionAmountStart != undefined && this.selectedTransactionAmountStop != undefined) {
        if (this.selectedTransactionAmountStart != 0 && this.selectedTransactionAmountStop != 0) {
          this.selectedFilter.f_credit = true;
          this.selectedFilter.creditMin = this.selectedTransactionAmountStart;
          this.selectedFilter.creditMax = this.selectedTransactionAmountStop;

        }
      }
      if (this.selectedUpdateStartDate != null && this.selectedUpdateStopDate != null) {
        if (this.selectedUpdateStartDate != "" && this.selectedUpdateStopDate != "") {
          this.selectedFilter.updateTimeStart = this.selectedUpdateStartDate;
          this.selectedFilter.updateTimeEnd = this.selectedUpdateStopDate;
          this.selectedFilter.f_updateTime = true;
        }
      }


      if (this.selectedFirstName != null) {
        if (this.selectedFirstName != '') {
          this.selectedFilter.userFirstName = this.selectedFirstName;
          this.selectedFilter.f_userFirstName = true;
        }
      }

      if (this.selectedLastName != null) {
        if (this.selectedLastName != '') {
          this.selectedFilter.userLastName = this.selectedLastName;
          this.selectedFilter.f_userLastName = true;
        }
      }
      if (this.selectedCode != null) {
        if (this.selectedCode != '') {
          this.selectedFilter.workerCode = this.selectedCode;
          this.selectedFilter.f_workerCode = true;
        }
      }
      if (this.selectedRegisterState != -1) {
          this.selectedFilter.workerRegisterStateId = this.selectedRegisterState;
          this.selectedFilter.f_workerRegisterStateId = true;
        
      }
      this.loading = true;
      this.transactionMgmService.creditSearch(this.selectedFilter).subscribe(response => {

        let out: WFinancialFilterSearchResult = new WFinancialFilterSearchResult();

        let seacrhResult: LastCreditSearchResult = <LastCreditSearchResult>response;
        out.workers = seacrhResult.workers;
        out.totalSize = seacrhResult.totalSize;
        out.lastCreditSearch = this.selectedFilter;
        out.selectedUpdateStartDate = this.selectedUpdateStartDate;
        out.selectedUpdateStopDate = this.selectedUpdateStopDate;
        out.selectedTransactionAmountStart = this.selectedTransactionAmountStart;
        out.selectedTransactionAmountStop = this.selectedTransactionAmountStop;
        out.selectedFirstName = this.selectedFirstName;
        out.selectedLastName = this.selectedLastName;
        out.selectedCode = this.selectedCode;

        this.onSearch.emit(out);
        this.loading = false;
      }, error => {
        let obj: LastCreditSearchResult = error.error;
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
