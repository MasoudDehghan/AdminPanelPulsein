import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { GrowlMessage } from '../../entities/growlMessage.class';
import { BackendMessage } from '../../entities/Msg.class';
import { ViewMsg } from '../../entities/viewMsg.class';
import { AdminService } from '../../services/admin.service';
import { SharedValues } from '../../services/shared-values.service';
import { HandleErrorMsg } from '../../shared/handleError.class';
import { Sms } from './../../entities/sms.class';

@Component({
  selector: 'app-send-sms',
  templateUrl: './send-sms.component.html',
  styleUrls: ['./send-sms.component.css'],
  providers: [AdminService]
})
export class SendSMSComponent implements OnInit {
  contentForm: FormGroup;
  errorCntrler: HandleErrorMsg;
  hmsgs: GrowlMessage[] = [];
  smsResponseMsgs: ViewMsg[] = [];
  smsContent: string = "";
  loading = false;
  @Input() smsList: Sms[] = [];
  smsSendCounter: number = 0
  smsListSize: number = 0;
  maxLengthChars:number = 500;
  reminingChars:number;
  constructor(private _router: Router, 
    private _fb: FormBuilder, public shared: SharedValues,
    private _smsService: AdminService) {
    this.errorCntrler = new HandleErrorMsg(_router);
  }
  ngOnInit() {
    this.contentForm = this._fb.group({
      smsContentCntrl: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxLengthChars)])]
    });
    this.reminingChars = this.maxLengthChars;
  }
  calculateChars(){
    this.reminingChars = this.maxLengthChars - this.smsContent.length;
  }
  onSubmitContentForm() {
    if (!this.contentForm.valid) {
      this.validateAllFormFields(this.contentForm);
      return;
    }
    this.smsResponseMsgs = [];
    this.hmsgs = [];
    this.smsListSize = this.smsList.length;
    this.loading = true;
    let obcList:any[] = [];
    this.smsList.forEach(sms => {
      sms.msg = this.smsContent;
      let obc = this._smsService.sendSMS(sms);
      obcList.push(obc);
    });
    
    forkJoin(obcList).subscribe(results=>{
      let list:any[] = results;
      for(let i=0;i<list.length;i++){
          let msg: BackendMessage = list[i];
          let vmsg:ViewMsg = new ViewMsg();
          vmsg.msg = this.shared.smsSendMsg + " " + this.smsList[i].mobileNumber;
          vmsg.error = false;
          this.hmsgs.push({ severity: 'info', summary: '', detail: vmsg.msg });
        }
        this.loading = false;
      
    },error=>{
      for(let i=0;i<error.length;i++){
        this.parseError(this.smsList[i],error[i].status, error[i]);
        }      
    });

  }


  parseError(sms: Sms, status: any, err: any) {
    this.errorCntrler.gMessage = [];
    this.hmsgs = [];
    let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(status, err);
    let errorMessages = this.errorCntrler.gMessage;
    errorMessages.forEach(element => {
      let vmsg: ViewMsg = new ViewMsg();
      vmsg.msg = element.detail + " " + sms.mobileNumber;
      vmsg.error = true;
      this.hmsgs.push({ severity: 'error', summary: '', detail: vmsg.msg });

    });
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
}
