import { UserP } from './../../pEntites/userP.class';
import { FinancialMgmService } from './../../services/financialMgm.service';
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { SharedValues } from '../../services/shared-values.service'
import { BackendMessage } from '../../entities/Msg.class'
import { HandleErrorMsg } from '../../shared/handleError.class'
import { GrowlMessage } from '../../entities/growlMessage.class'
import { TransactionP } from 'app/pEntites/transactionP.class';
import * as moment from 'jalali-moment';
import { Moment } from 'jalali-moment';
@Component({
  selector: 'app-transaction-register',
  templateUrl: './transaction-register.component.html',
  providers: [FinancialMgmService],
  styleUrls: ['./transaction-register.component.css']
})
export class TransactionRegisterComponent implements OnInit {
  registerForm: FormGroup;
  selectedTransaction: TransactionP = new TransactionP();
  loading = false;

  @Input() inputUserID:number;
  @Input() transactionTypeList: SelectItem[] = [];
  @Input() showTransactionTypeFilter = true;
  @Input() selectedTransactionAmount: number;
  selectedTrackingCode : string = null;
  selectedPaymentType: TransactionP;
  selectedRegisterDate:string;
  @Output() onClose = new EventEmitter<TransactionP>();
  
  errorCntrler: HandleErrorMsg;
  msgs: GrowlMessage[] = [];
  datePickerConfig = {
    drops: 'down',
    format: 'YYYY/MM/DD HH:mm:ss',
    appendTo:'body'
  };
  _registerDate : Moment;
  constructor(private _router: Router, private _fb: FormBuilder,
    public transactionMgmService: FinancialMgmService,
    public shared: SharedValues) { }

  ngOnInit() {
    this.registerForm = this._fb.group({
      transactionAmountFormCntrl: ['',Validators.compose([Validators.required,Validators.min(1000),Validators.max(10000000)])],
      trackingCodeFormCntrl: ['',Validators.required],
      PaymentTypeFormCntrl: [''],
      registerDate: ['']
    });
    this.selectedPaymentType = this.transactionTypeList[0].value;
    this.errorCntrler = new HandleErrorMsg(this._router);

  }


 
  onSubmit() {
    try {
      if(!this.registerForm.valid){
        this.validateAllFormFields(this.registerForm);
        return;
      }
      if(this.selectedRegisterDate='')
        {
          this.msgs.push({ severity: 'error', summary: '', detail: this.shared.InnerCode_InvalidTimeMsg });
          return;
        }
      this.loading = true;
      if(this._registerDate!=undefined)
        this.selectedRegisterDate = moment(this._registerDate).locale('fa').format('YYYY/MM/DD HH:mm:ss'); 
      this.selectedTransaction.amount = this.selectedTransactionAmount;
      this.selectedTransaction.trackingCode = this.selectedTrackingCode;
      this.selectedTransaction.user = new UserP();
      this.selectedTransaction.user.id = this.inputUserID;
      if(!this.showTransactionTypeFilter)        
        this.selectedPaymentType = this.transactionTypeList[1].value;        
      this.selectedTransaction.transactionTypeId = this.selectedPaymentType.id;
      this.selectedTransaction.depositTime = this.selectedRegisterDate;
      this.transactionMgmService.register(this.selectedTransaction).subscribe(response => {
        let transaction: TransactionP = <TransactionP>response;
        this.onClose.emit(transaction);
        this.loading = false;
      }, error => {
        let obj: TransactionP = error.error;
        let err: BackendMessage = obj.error;
        this.parseError(error.status, err);
        this.loading = false;
      });

    }
    catch (e) {
      console.log(e);
    }
  }
validateAllFormFields(formGroup: FormGroup) {         
  Object.keys(formGroup.controls).forEach(field => { 
    const control = formGroup.get(field);             
    if (control instanceof FormControl) {            
      control.markAsTouched({ onlySelf: true });
      control.markAsDirty({ onlySelf: true });
    } else if (control instanceof FormGroup) {        
      this.validateAllFormFields(control);            
    }
  });
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
