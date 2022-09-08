import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartableSummary } from '../../entities/cartableSummary.class';
import { GrowlMessage } from '../../entities/growlMessage.class';
import { BackendMessage } from '../../entities/Msg.class';
import { CartableService } from '../../services/cartable.service';
import { SharedValues } from '../../services/shared-values.service';
import { HandleErrorMsg } from '../../shared/handleError.class';
import { environment } from './../../../environments/environment';


@Component({
    moduleId: module.id,
    selector: 'cartableDashboard',
    templateUrl: './cartable-dashboard.template.html',
    styleUrls: ['./cartable-dashboard.component.css'],
    providers: [CartableService]

})

export class CartableDashboardComponent {

    activeLabel: string = this.shared.cartableDashboard;
    loading: boolean = false;
    hmsgs: GrowlMessage[] = [];
    errorCntrler: HandleErrorMsg;
    baseImagePath: string;

    stat: CartableSummary = new CartableSummary();

    selectedImagePath: string;
    displayImageDialog: boolean = false;
    displayWorkerView: boolean = false;
    displayWorkerEditDialog: boolean = false;
    displayWorkStationDetailDialog: boolean = false;
    displayWorkStationEditDialog: boolean = false;



    wsCartableLabel: string = "";
    wrCartableLabel: string = "";
    wsDocumentCartablLabel: string = "";
    wrDocumentCartablLabel: string = "";
    wrUsersProfileCartablLabel: string = "";
    wsLogosCartablLabel: string = "";
    wsCatalogsCartablLabel: string = "";
    expiredRequestCartableLabel: string = "";
    displayDashboard: boolean = false;

    displayMainCartable: boolean = false;
    displayWorkstationCartable: boolean = false;
    numOfTotalWsCbEntries: number = 0;
    numOfTotalWrCbEntries: number = 0;
    numOfTotalExpiredRequest: number = 0;


    constructor(private _router: Router,
        public shared: SharedValues,
        private _CartableService: CartableService) {

    }
    ngOnInit() {
        this.errorCntrler = new HandleErrorMsg(this._router);
        this.baseImagePath = environment.fileServerUrl;
        this.showMainCartable();
    }

    showMainCartable() {
        this.loading = true;
        this._CartableService.getSummary().subscribe(response => {
            this.stat = <CartableSummary>response;
            this.displayMainCartable = true;
            this.numOfTotalWsCbEntries = this.stat.wsCatalogCnt + this.stat.wsLogoCnt + this.stat.wsDocCnt;
            this.numOfTotalWrCbEntries =this.stat.wrDocCnt + this.stat.userPhotoCnt ;
            this.numOfTotalExpiredRequest = this.stat.reqExpireCnt;
            this.loading = false;
        }, error => {
            this.loading = false;
            this.displayMainCartable = false;
            let obj: CartableSummary = error.error;
            let err: BackendMessage = obj.error;
            this.parseError(error.status, err);
        });
    }
    refreshDashboard() {

        this.loading = true;
        this._CartableService.getSummary().subscribe(response => {
            this.stat = <CartableSummary>response;
            this.displayMainCartable = true;
            this.loading = false;
        }, error => {
            this.loading = false;
            let obj: CartableSummary = error.error;
            let err: BackendMessage = obj.error;
            this.parseError(error.status, err);
        });
    }
    showWorkStationCartableDashboard() {
        this._router.navigate(['/CartableWorkStationComponent']);
    }
    showWorkerCartableDashboard() {
        this._router.navigate(['/CartableWorkerComponent']);
    }
    showExpiredRequestCartableDashboard() {
        this._router.navigate(['/CartableExpiredRequstComponent']);
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