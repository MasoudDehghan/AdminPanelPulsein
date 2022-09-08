import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { ConfirmationService, SelectItem } from 'primeng/primeng';
import { CartableSummary } from '../../entities/cartableSummary.class';
import { GrowlMessage } from '../../entities/growlMessage.class';
import { BackendMessage } from '../../entities/Msg.class';
import { UserRoleEnum } from '../../enums/userRole.enum';
import { CartableService } from '../../services/cartable.service';
import { SharedValues } from '../../services/shared-values.service';
import { HandleErrorMsg } from '../../shared/handleError.class';
import { environment } from './../../../environments/environment';
import { BasicData } from './../../entities/basicData.class';
import { RequestP } from './../../pEntites/requestP.class';
import { RequestMgmService } from './../../services/requestMgm.service';

@Component({
    moduleId: module.id,
    selector: 'cartable-reqx',
    templateUrl: './cartable-reqx.template.html',
    styleUrls: ['./cartable-reqx.component.css'],
    providers: [RequestMgmService, CartableService]

})

export class CartableExpiredRequstComponent {

    activeLabel: string = this.shared.expiredRequestCartableLabel;
    loading: boolean = false;
    hmsgs: GrowlMessage[] = [];
    imsgs: Message[] = [];
    errorCntrler: HandleErrorMsg;
    baseImagePath: string;

    stat: CartableSummary = new CartableSummary();


    selectedImagePath: string;
    displayImageDialog: boolean = false;




    wsCartableLabel: string = "";
 
    expiredRequestCartableLabel: string = "";


    selectedImageCatalog: any;
    displayCatalogImageDialog: boolean = false;



    numOfTotalExpiredRequest:number = 0;
    displayExpiredRequestCartable = false;
    expiredRequests:RequestP[] = [];
    basicData: BasicData;

    loadingDialog:boolean = false;
    displayRequestView:boolean = false;
    displayRequestSnoozeDialog:boolean = false;
    selectedRequestP:RequestP = null;
    snoozeCountList:SelectItem[];
    selectedSnoozeCount:number;
    editCapable:boolean = false;
    
    constructor(private _router: Router, 
        public shared: SharedValues,
        private confirmationService: ConfirmationService,
        public requestMgmService: RequestMgmService,
        private _CartableService: CartableService) {

    }
    ngOnInit() {
        this.errorCntrler = new HandleErrorMsg(this._router);
        this.baseImagePath = environment.fileServerUrl;
        this.basicData = JSON.parse(localStorage.getItem('basicData'));
        let loggedInRole = Number(sessionStorage.getItem("roleId"));
        this.editCapable = false;
        if(loggedInRole == UserRoleEnum.SysAdmin || loggedInRole == UserRoleEnum.Operator_H)
            this.editCapable = true;
        this.snoozeCountList = [
            {label:'1 '+this.shared.workingDayLabel, value:1},
            {label:'2 '+this.shared.workingDayLabel, value:2},
            {label:'3 '+this.shared.workingDayLabel, value:3},
            {label:'4 '+this.shared.workingDayLabel, value:4},
            {label:'5 '+this.shared.workingDayLabel, value:5}
        ];

        this.showExpiredRequestCartableDashboard();
    }

 
    showExpiredRequestCartableDashboard(){
        this.setToDefaultFlags();
        this.loading = true;
        this._CartableService.getExpiredRequestList().subscribe(response => {
            this.expiredRequests = <RequestP[]>response;
            this.displayExpiredRequestCartable = true;
            this.loading = false;
        }, error => {
            this.loading = false;
            let obj: CartableSummary = error.error;
            let err: BackendMessage = obj.error;
            this.parseError(error.status, err);
        });
    }
    setToDefaultFlags() {

        this.displayExpiredRequestCartable = false;
    }

  
    onSubmitSnoozeDialog(){
        this.displayRequestSnoozeDialog = false;
        this.handleSnoozeExpireRequest(this.selectedRequestP,this.selectedSnoozeCount);
    }
   
    showRequestViewDialog(request: RequestP) {
        let id = request.id;
        this.loadingDialog = true;
        this.displayRequestView = true;
        
        this.requestMgmService.lookupByIdP(id).subscribe(result => {
          this.selectedRequestP = <RequestP>result;
          this.loadingDialog = false;
          console.log(result);
        }, error => {
          console.log(error);
          this.displayRequestView = false;
          this.loadingDialog = false;
          
          let obj: RequestP = error.error;
          let err: BackendMessage = obj.error;
          this.parseError(error.status, err);
        });
      }
      showRequestSnoozeDialog(request: RequestP) {
        let id = request.id;
        this.displayRequestSnoozeDialog = true;
        this.selectedRequestP = request;

      }
  
    findRequestIndex(list:RequestP[], requestP:RequestP):number{
        for (let i = 0; i < list.length; i++) {
            let element: RequestP = list[i];
            if (element.id == requestP.id)
                return i;
        }
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

   
    handleCancelExpireRequest(request: RequestP) {
        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                this.loading = true;
                
                if(request.state == this.shared.reqWait4Payment || request.state == this.shared.reqWait4Nazarsanji){
                    this._CartableService.closeRequest(request.id).subscribe(response => {
                      let index = this.findRequestIndex(this.expiredRequests,request);
                      this.expiredRequests = this.expiredRequests.filter((val, i) => i != index);
                      this.hmsgs = [];
                      this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
                      this.loading = false;
                    }, error => {
                      console.log(error);
                      this.loading = false;
                      let err: BackendMessage = error.error;
                      this.parseError(error.status, err);
                    })
    
                }
                else{
                    this._CartableService.cancelExipredRequest(request).subscribe(response => {
                        let index = this.findRequestIndex(this.expiredRequests, request);
                        this.expiredRequests = this.expiredRequests.filter((val, i) => i != index);
                        this.hmsgs = [];
                        this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
                        this.loading = false;
                    }, error => {
                        console.log(error);
                        let err: BackendMessage = error.error;
                        this.parseError(error.status, err);
                        this.loading = false;
                    });
                }
            }
        });
    }
    handleSnoozeExpireRequest(request: RequestP,snoozeDay:number) {
        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                this.loading = true;
                console.log(request);
                this._CartableService.snoozeExpiredRequest(request.id,snoozeDay).subscribe(response => {
                    let index = this.findRequestIndex(this.expiredRequests, request);
                    this.expiredRequests = this.expiredRequests.filter((val, i) => i != index);
                    this.hmsgs = [];
                    this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
                    this.loading = false;
                }, error => {
                    console.log(error);
                    let err: BackendMessage = error.error;
                    this.parseError(error.status, err);
                    this.loading = false;
                })
            }
        });
    }
    closeRequest(request:RequestP) {
        this.confirmationService.confirm({
          message: this.shared.confirmText,
          accept: () => {
            this.loading = true;
            this._CartableService.closeRequest(request.id).subscribe(response => {
              let index = this.findRequestIndex(this.expiredRequests,request);
              this.expiredRequests = this.expiredRequests.filter((val, i) => i != index);
              this.hmsgs = [];
              this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
              this.loading = false;
            }, error => {
              console.log(error);
              this.loading = false;
              let err: BackendMessage = error.error;
              this.parseError(error.status, err);
            })
          }
        });
      }
    
    onShowImage(event) {
        this.displayImageDialog = true;
        this.selectedImagePath = event;
    }
}