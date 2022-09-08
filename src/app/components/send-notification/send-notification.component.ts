import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommercialNotification } from 'app/entities/CommercialNotification.class';
import { JobCategory3 } from 'app/entities/JobCategory3.class';
import { NotificationRegister } from 'app/entities/NotificationRegister.class';
import { environment } from 'environments/environment';
import { GrowlMessage } from '../../entities/growlMessage.class';
import { BackendMessage } from '../../entities/Msg.class';
import { AdminService } from '../../services/admin.service';
import { SharedValues } from '../../services/shared-values.service';
import { HandleErrorMsg } from '../../shared/handleError.class';
import { BasicData } from './../../entities/basicData.class';
import { Constant } from './../../shared/constants.class';

@Component({
  selector: 'app-send-notification',
  templateUrl: './send-notification.component.html',
  styleUrls: ['./send-notification.component.css'],
  providers: [AdminService]
})
export class SendNotificationComponent implements OnInit {
  contentForm: FormGroup;
  errorCntrler: HandleErrorMsg;
  hmsgs: GrowlMessage[] = [];
  loading = false;
  @Input() userIDList: number[] = [];
  @Output() onClose = new EventEmitter<boolean>();
  linkCat: number;
  isBig: boolean;
  imageUrl: string;
  title: string;//100 char
  content: string;//1000 char
  vibrate: boolean;
  sound: boolean;
  led: boolean;
  jobCat3Result: JobCategory3[] = [];
  basicData: BasicData;
  uploadURL: string;
  uploadedImageName: string = "";
  uploadedFiles: any[] = [];
  baseImagePath = environment.fileServerUrl;
  selectedImagePath: string = "";
  displayImageUpload = false;
  fileSize = Constant.maximumFileSize200;
  constructor(private _router: Router,
    private _fb: FormBuilder, public shared: SharedValues,
    private _smsService: AdminService) {
    this.errorCntrler = new HandleErrorMsg(_router);
  }
  ngOnInit() {
    this.contentForm = this._fb.group({
      linkCat: [null],
      isBig: [false],
      title: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      content: [null, Validators.compose([Validators.required, Validators.maxLength(500)])],
      vibrate: [false],
      sound: [false],
      led: [false]
    });
    this.basicData = JSON.parse(localStorage.getItem('basicData'));
    let token: String = sessionStorage.getItem('token');
    this.uploadURL = environment.apiUrl + "/upload/img/" + token;
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
  onUpload(event: any) {
    let responseMsg: BackendMessage = JSON.parse(event.xhr.responseText);
    this.uploadedImageName = responseMsg.msg[0].msg;
    this.selectedImagePath = this.uploadedImageName;
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

  }
  onSubmitContentForm() {
    if (!this.contentForm.valid) {
      this.validateAllFormFields(this.contentForm);
      return;
    }
    this.hmsgs = [];
    let notificationRegister = new NotificationRegister();
    let commercialNotification = new CommercialNotification();
    let linkCat = 0;
    if(this.contentForm.controls["linkCat"].value != undefined && 
          this.contentForm.controls["linkCat"].value != null)
      linkCat = this.contentForm.controls["linkCat"].value.id;
    let isBig = this.contentForm.controls["isBig"].value;
    let title = this.contentForm.controls["title"].value;
    let content = this.contentForm.controls["content"].value;
    let vibrate = this.contentForm.controls["vibrate"].value;
    let sound = this.contentForm.controls["sound"].value;
    let led = this.contentForm.controls["led"].value;

    commercialNotification.linkCat = linkCat;
    commercialNotification.isBig = isBig;
    commercialNotification.title = title;
    commercialNotification.content = content;
    commercialNotification.vibrate = vibrate;
    commercialNotification.sound = sound;
    commercialNotification.led = led;
    if(isBig && this.selectedImagePath == ''){
      this.hmsgs.push({ severity: 'error', summary: this.shared.errorLabel, detail: this.shared.imageNotSent});
      return;
    }

    if(isBig && this.selectedImagePath!=''){
      commercialNotification.imageUrl = this.selectedImagePath;
    }


    notificationRegister.data = commercialNotification;
    notificationRegister.userIds = this.userIDList;
    this.loading = true;
    console.log(notificationRegister);
    this._smsService.sendNotification(notificationRegister).subscribe(result => {      
      this.onClose.emit(true);
    }, error => {
      console.log(error);
      this.loading = false;
      this.parseError(error.status, error);
    }, () => {
      this.loading = false;
    });

  }

  onChange(event){
    this.displayImageUpload = event;
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
