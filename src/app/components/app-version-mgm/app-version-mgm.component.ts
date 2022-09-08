import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'jalali-moment';
import { Moment } from 'jalali-moment';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/primeng';
import { GrowlMessage } from '../../entities/growlMessage.class';
import { BackendMessage } from '../../entities/Msg.class';
import { AppVersion } from '../../pEntites/appVersion.class';
import { AppVersionService } from '../../services/appVersion.service';
import { SharedValues } from '../../services/shared-values.service';
import { HandleErrorMsg } from '../../shared/handleError.class';



@Component({
  selector: 'app-app-version-mgm',
  templateUrl: './app-version-mgm.component.html',
  providers: [AppVersionService, MessageService],
  styleUrls: ['./app-version-mgm.component.css']
})
export class AppVersionMgmComponent implements OnInit {
  form: FormGroup;
  workerAppVersions: AppVersion[] = [];
  clientAppVersions: AppVersion[] = [];
  errorCntrler: HandleErrorMsg;
  hmsgs: GrowlMessage[] = [];
  cDataTableLoading: boolean = false;
  wDataTableLoading: boolean = false;
  activeLabel: string = this.shared.menuItem3SubItem2Label;
  showWorkerAppList: boolean = false;
  showClientAppList: boolean = false;
  selectedApp: AppVersion = new AppVersion();
  displayDialog: boolean;
  newClientAppVersion: boolean;
  newWorkerAppVersion: boolean;
  editClientAppVersion: boolean;
  editWorkerAppVersion: boolean;
  onCRowSelected: boolean = false;
  onWRowSelected: boolean = false;
  innerPannelGMessage: Message[] = [];

  showErrorMsgInPanel: boolean = false;
  errorMsgInPanel: string[] = [];
  loading: boolean = false;
  editPanelHeader: string;
  datePickerConfig = {
    drops: 'up',
    format: 'YYYY/MM/DD HH:mm:ss',
    appendTo: 'body'
  };
  dateObject: Moment;

  constructor(private _router: Router,
    private appVersionService: AppVersionService,
    private confirmationService: ConfirmationService,
    private _fb: FormBuilder, public shared: SharedValues) { }

  ngOnInit() {
    this.errorCntrler = new HandleErrorMsg(this._router);
    this.form = this._fb.group({
      name: [this.selectedApp.name],
      info: [this.selectedApp.info],
      workerApp: [this.selectedApp.workerApp],
      active: [this.selectedApp.active],
      releaseTimeS: [this.selectedApp.releaseTimeS],
      deviceType: ["android"]
    });
    this.refresh();
  }


  rtvWorkerAppList() {
    this.wDataTableLoading = true;
    this.appVersionService.getListAllW().subscribe(response => {
      this.showWorkerAppList = true;
      this.workerAppVersions = <AppVersion[]>response;
      this.wDataTableLoading = false;
    }
      , error => {
        this.showWorkerAppList = false;
        this.hmsgs = [];
        this.errorCntrler.gMessage = [];
        let obj: AppVersion[] = error.error;
        let err: BackendMessage = obj[0].error;
        let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
        let errorMessages = this.errorCntrler.gMessage;
        errorMessages.forEach(element => {
          this.hmsgs.push(element);
        });
        this.wDataTableLoading = false;
      }
    );
  }
  rtvClientAppList() {
    this.cDataTableLoading = true;
    this.appVersionService.getListAllC().subscribe(response => {
      this.showClientAppList = true;
      this.clientAppVersions = <AppVersion[]>response;
      this.cDataTableLoading = false;
    }
      , error => {
        this.showClientAppList = false;
        this.hmsgs = [];
        this.errorCntrler.gMessage = [];
        let obj: AppVersion[] = error.error;
        let err: BackendMessage = obj[0].error;
        let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
        let errorMessages = this.errorCntrler.gMessage;
        errorMessages.forEach(element => {
          this.hmsgs.push(element);
        });
        this.cDataTableLoading = false;
      }
    );
  }
  onClientAppRowSelect(event: any) {
    this.clearFlags();
    this.selectedApp = this.cloneAppVersion(event.data);
    this.displayDialog = true;
    this.innerPannelGMessage = [];
    this.showErrorMsgInPanel = false;
    this.form.clearValidators();
    this.form.markAsUntouched();
    this.form.controls['name'].clearAsyncValidators();
    this.form.controls['name'].clearValidators();
    if (!this.selectedApp.ios)
      this.form.controls['deviceType'].setValue("android");
    else
      this.form.controls['deviceType'].setValue("ios");
    this.onCRowSelected = true;
    this.editPanelHeader = this.shared.editPanelLabel;
  }
  onWorkerAppRowSelect(event: any) {
    this.clearFlags();
    this.selectedApp = this.cloneAppVersion(event.data);
    this.innerPannelGMessage = [];
    this.showErrorMsgInPanel = false;
    this.form.clearValidators();
    this.form.markAsUntouched();
    this.form.controls['name'].clearAsyncValidators();
    this.form.controls['name'].clearValidators();
    this.displayDialog = true;
    this.onWRowSelected = true;
    this.editPanelHeader = this.shared.editPanelLabel;
  }
  save() {
    if (this.dateObject != undefined)
      this.selectedApp.releaseTimeS = moment(this.dateObject).locale('fa').format('YYYY/MM/DD HH:mm:ss');
    if (!this.form.valid) {
      this.validateAllFormFields(this.form);
      return;
    }
    this.loading = true;
    let devType = this.form.controls["deviceType"].value;
    if (devType == 'ios') {
      this.selectedApp.ios = true;
    } else {
      this.selectedApp.ios = false;
    }

    //this.selectedApp.releaseTimeS = (<HTMLInputElement>document.getElementById('releaseTime_input')).value;
    if (this.newClientAppVersion) {
      this.selectedApp.workerApp = false;
      let clientAppList = [...this.clientAppVersions];
      this.appVersionService.add(this.selectedApp)
        .subscribe(response => {
          this.selectedApp = <AppVersion>response;
          clientAppList.push(this.selectedApp);
          this.clientAppVersions = clientAppList;
          this.displayDialog = false;
          this.loading = false;
        },
          error => {
            this.showErrorMsgInPanel = true;
            this.innerPannelGMessage = [];
            this.errorCntrler.gMessage = [];
            let obj: AppVersion = error.error;
            let err: BackendMessage = obj.error;
            let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
            let errorMessages = this.errorCntrler.gMessage;
            this.innerPannelGMessage = this.errorCntrler.iMessage;
            this.loading = false;
          });
    }
    else if (this.newWorkerAppVersion) {
      this.selectedApp.workerApp = true;
      let workerAppList = [...this.workerAppVersions];
      this.appVersionService.add(this.selectedApp)
        .subscribe(response => {
          this.selectedApp = <AppVersion>response;
          workerAppList.push(this.selectedApp);
          this.workerAppVersions = workerAppList;
          this.displayDialog = false;
          this.loading = false;
        },
          error => {
            this.showErrorMsgInPanel = true;
            this.innerPannelGMessage = [];
            this.errorCntrler.gMessage = [];
            let obj: AppVersion = error.error;
            let err: BackendMessage = obj.error;
            let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
            let errorMessages = this.errorCntrler.gMessage;
            this.innerPannelGMessage = this.errorCntrler.iMessage;
            this.loading = false;
          });
    }
    else {

      this.appVersionService.edit(this.selectedApp)
        .subscribe(response => {
          if (this.onCRowSelected || this.editClientAppVersion) {
            let clientAppList = [...this.clientAppVersions];
            clientAppList[this.findAppVersionIndex(this.clientAppVersions, this.selectedApp)] = this.selectedApp;
            this.clientAppVersions = clientAppList;
          }
          if (this.onWRowSelected || this.editClientAppVersion) {
            let workerAppList = [...this.workerAppVersions];
            workerAppList[this.findAppVersionIndex(this.workerAppVersions, this.selectedApp)] = this.selectedApp;
            this.workerAppVersions = workerAppList;
          }

          this.displayDialog = false;
          this.loading = false;
        },
          error => {
            this.showErrorMsgInPanel = true;
            this.innerPannelGMessage = [];
            this.errorCntrler.gMessage = [];
            let err: BackendMessage = error.error;
            let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
            let errorMessages = this.errorCntrler.gMessage;
            this.innerPannelGMessage = this.errorCntrler.iMessage;
            this.loading = false;
          });
    }

  }
  editC(appVersion: AppVersion) {
    this.clearFlags();
    this.selectedApp = this.cloneAppVersion(appVersion);
    this.form.clearValidators();
    this.form.markAsUntouched();
    if (!this.selectedApp.ios)
      this.form.controls['deviceType'].setValue("android");
    else
      this.form.controls['deviceType'].setValue("ios");
    this.displayDialog = true;
    this.editClientAppVersion = true;
    this.editPanelHeader = this.shared.editPanelLabel;
  }
  editW(appVersion: AppVersion) {
    this.clearFlags();
    this.selectedApp = this.cloneAppVersion(appVersion);
    this.form.clearValidators();
    this.form.markAsUntouched();

    this.displayDialog = true;
    this.editWorkerAppVersion = true;
    this.editPanelHeader = this.shared.editPanelLabel;
  }

  deleteClientApp(appVersion: AppVersion) {
    this.confirmationService.confirm({
      message: this.shared.confirmText,
      accept: () => {
        this.loading = true;
        this.appVersionService.delete(appVersion)
          .subscribe(response => {
            this.loading = false;
            let index = this.findAppVersionIndex(this.clientAppVersions, appVersion);
            this.clientAppVersions = this.clientAppVersions.filter((val, i) => i != index);
            this.displayDialog = false;
          },
            error => {
              this.innerPannelGMessage = [];
              this.errorCntrler.gMessage = [];
              let err: BackendMessage = error.error;
              let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
              let errorMessages = this.errorCntrler.gMessage;
              this.innerPannelGMessage = this.errorCntrler.iMessage;
              this.loading = false;

            });
      }
    });

  }
  deleteWorkerApp(appVersion: AppVersion) {
    this.confirmationService.confirm({
      message: this.shared.confirmText,
      accept: () => {
        this.loading = true;
        this.appVersionService.delete(appVersion)
          .subscribe(response => {
            this.loading = false;
            let index = this.findAppVersionIndex(this.workerAppVersions, appVersion);
            this.workerAppVersions = this.workerAppVersions.filter((val, i) => i != index);
            this.displayDialog = false;
          },
            error => {
              this.innerPannelGMessage = [];
              this.errorCntrler.gMessage = [];
              let err: BackendMessage = error.error;
              let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
              let errorMessages = this.errorCntrler.gMessage;
              this.innerPannelGMessage = this.errorCntrler.iMessage;
              this.loading = false;

            });
      }
    });

  }
  refresh() {
    this.rtvClientAppList();
    this.rtvWorkerAppList();
  }
  showCDialogToAdd() {
    this.clearFlags();
    this.newClientAppVersion = true;
    this.selectedApp = new AppVersion();
    this.innerPannelGMessage = [];
    this.showErrorMsgInPanel = false;

    this.displayDialog = true;
    this.editPanelHeader = this.shared.registerNewClientAppVersion;

    this.form.clearValidators();
    this.form.reset();

    this.form.controls['deviceType'].setValue("android");
  }
  showWDialogToAdd() {
    this.clearFlags();
    this.newWorkerAppVersion = true;
    this.selectedApp = new AppVersion();
    this.innerPannelGMessage = [];
    this.showErrorMsgInPanel = false;

    this.displayDialog = true;
    this.editPanelHeader = this.shared.registerNewWorkerAppVersion;
    this.form.clearValidators();
    this.form.reset();
  }
  clearFlags() {
    this.newClientAppVersion = false;
    this.newWorkerAppVersion = false;
    this.displayDialog = false;
    this.onCRowSelected = false;
    this.onWRowSelected = false;
    this.editClientAppVersion = false;
    this.editWorkerAppVersion = false;


  }
  handleChange(e) {
    let index = e.index;
    if (index == 0)
      this.rtvClientAppList();
    if (index == 1)
      this.rtvWorkerAppList();
  }
  cloneAppVersion(appVersion: AppVersion): AppVersion {
    let appv = new AppVersion();
    appv.id = appVersion.id;
    appv.name = appVersion.name;
    appv.info = appVersion.info;
    appv.releaseTimeS = appVersion.releaseTimeS;
    appv.active = appVersion.active;
    appv.workerApp = appVersion.workerApp;
    appv.ios = appVersion.ios;
    return appv;
  }
  findAppVersionIndex(appVersionList: AppVersion[], appv: AppVersion): number {
    for (let i = 0; i < appVersionList.length; i++) {
      if (appv.id == appVersionList[i].id)
        return i;
    }
    return -1;
  }
  findSelectedAppVersionIndex(appVersionList: AppVersion[], appv: AppVersion): number {
    return appVersionList.indexOf(appv);
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        if (this.form.get('name') != control) {
          control.markAsTouched({ onlySelf: true });
          control.markAsDirty({ onlySelf: true });
        }
        else {
          if (this.newClientAppVersion || this.newWorkerAppVersion) {
            control.markAsTouched({ onlySelf: true });
            control.markAsDirty({ onlySelf: true });
          }
        }
      } else if (control instanceof FormGroup) {

        if (control['name'] != 'name')
          this.validateAllFormFields(control);
      }
    });
  }
}
