import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GrowlMessage } from '../../entities/growlMessage.class';
import { BackendMessage } from '../../entities/Msg.class';
import { RequestStatistics } from '../../entities/requestStatistics.class';
import { Statistics } from '../../entities/statistics.class';
import { RequestStateEnum } from '../../enums/requestState.enum';
import { SharedValues } from '../../services/shared-values.service';
import { StatisticsService } from '../../services/statistics.service';
import { HandleErrorMsg } from '../../shared/handleError.class';
import { environment } from './../../../environments/environment';


@Component({
    moduleId: module.id,
    selector: 'requestDashboard',
    templateUrl: './request-dashboard.template.html',
    styleUrls: ['../../../assets/css/dashboard.css'],
    providers: [StatisticsService]

})

export class RequestDashboardComponent {

    activeLabel: string = this.shared.currentRequestsLabel;
    loading: boolean = false;
    hmsgs: GrowlMessage[] = [];
    errorCntrler: HandleErrorMsg;
    baseImagePath: string;

    stat: RequestStatistics = new RequestStatistics();
    allReqCounter:number = 0;
    @Input() showFinishedRequests:boolean = false;
    allRequestLabel:string = "";
    paramSubscriber: any;
    currentRequestState:number = 0 ;
    constructor(private _router: Router,
        public shared: SharedValues,
        private _StatisticsService: StatisticsService) {

    }
    ngOnInit() {
        this.errorCntrler = new HandleErrorMsg(this._router);
        this.baseImagePath = environment.fileServerUrl;
        // this.showFinishedRequests = false;
        // this.paramSubscriber = this._activatedRouter.params.subscribe(params => {
        //     let _param = params['showFinishedRequests'];
        //     if (_param == 1)
        //         this.showFinishedRequests = true;
        // });
        this.refreshCurrentDashboard();          
  
    }
    
    refreshCurrentDashboard(){
        this.loading = true;
        this._StatisticsService.getRequestStatistics().subscribe(response => {
            this.stat = <RequestStatistics>response;
            if(!this.showFinishedRequests){
                this.allReqCounter = this.stat.reqInProgress+this.stat.reqSuggestFinished+
                this.stat.reqWait4Do+this.stat.reqWait4Nazarsanji+
                this.stat.reqWait4Payment+this.stat.reqWait4Suggest
                +this.stat.reqWait4DoAck;
                this.allRequestLabel = this.shared.allCurrentRequest;
            }
            else
            {
                this.allReqCounter = this.stat.reqCanceledC+this.stat.reqCanceledW+this.stat.reqCanceledO+
                this.stat.reqExpire+this.stat.reqFinished;
                this.allRequestLabel = this.shared.allFinishedRequest;
                this.activeLabel = this.shared.finishedRequestsLabel;

            }
            this.loading = false;
        }, error => {
            this.loading = false;
            let obj: Statistics = error.error;
            let err: BackendMessage = obj.error;
            this.parseError(error.status, err);
        });
    }
    onClickWait4SuggestRequest(){
        this.currentRequestState = RequestStateEnum.waitToOffer;
        this._router.navigate(['/RequestMgmComponent', { load: this.currentRequestState }]);
    }
    onClickSuggestFinishedRequest(){
        this.currentRequestState = RequestStateEnum.offerTimeFinished;
        this._router.navigate(['/RequestMgmComponent', { load: this.currentRequestState }]);
    }

    onClickWait4DoAckRequest(){
        this.currentRequestState = RequestStateEnum.Wait4DoAck;
        this._router.navigate(['/RequestMgmComponent', { load: this.currentRequestState }]);
    }
    onClickInProgressRequest(){
        this.currentRequestState = RequestStateEnum.ongoing;
        this._router.navigate(['/RequestMgmComponent', { load: this.currentRequestState }]);
    }
    onClickWait4PaymentRequest(){
        this.currentRequestState = RequestStateEnum.waitToPayment;
        this._router.navigate(['/RequestMgmComponent', { load: this.currentRequestState }]);
    }
    onClickWait4PaymentRequestExpired(){
        this.currentRequestState = RequestStateEnum.waitToPayment;
        this._router.navigate(['/RequestMgmComponent', { load: this.currentRequestState, expired:0 }]);
    }
    onClickWait4PollRequest(){
        this.currentRequestState = RequestStateEnum.waitToPoll;
        this._router.navigate(['/RequestMgmComponent', { load: this.currentRequestState}]);
    }
    onClickFinishedRequest(){
        this.currentRequestState = RequestStateEnum.finished;
        this._router.navigate(['/RequestMgmComponent', { load: this.currentRequestState }]);
    }
    onClickCanceledCRequest(){
        this.currentRequestState = RequestStateEnum.canceled;
        this._router.navigate(['/RequestMgmComponent', { load: this.currentRequestState }]);
    }
    onClickCanceledWRequest(){
        this.currentRequestState = RequestStateEnum.canceledByWorker;
        this._router.navigate(['/RequestMgmComponent', { load: this.currentRequestState }]);
    }
    onClickCanceledORequest(){
        this.currentRequestState = RequestStateEnum.canceledByOperator;
        this._router.navigate(['/RequestMgmComponent', { load: this.currentRequestState }]);
    }
    onClickExpiredRequest(){
        this.currentRequestState = RequestStateEnum.expired;
        this._router.navigate(['/RequestMgmComponent', { load: this.currentRequestState }]);
    }

    onClickAll(){
        if(!this.showFinishedRequests)
            this._router.navigate(['/RequestMgmComponent', { current: true,load:-1 }]);
        else
             this._router.navigate(['/RequestFinishedComponent']);


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