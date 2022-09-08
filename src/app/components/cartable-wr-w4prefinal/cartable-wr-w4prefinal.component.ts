import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { ConfirmationService } from 'primeng/primeng';
import { CartableSummary } from '../../entities/cartableSummary.class';
import { GrowlMessage } from '../../entities/growlMessage.class';
import { BackendMessage } from '../../entities/Msg.class';
import { User } from '../../entities/user.class';
import { Worker } from '../../entities/worker.class';
import { WorkerDocument } from '../../entities/workerDocument.class';
import { WorkerPhone } from '../../entities/workerPhone.class';
import { UserRoleEnum } from '../../enums/userRole.enum';
import { CartableService } from '../../services/cartable.service';
import { SharedValues } from '../../services/shared-values.service';
import { WorkerMgmService } from '../../services/workerMgm.service';
import { HandleErrorMsg } from '../../shared/handleError.class';
import { environment } from './../../../environments/environment';
import { BasicData } from './../../entities/basicData.class';


@Component({
    moduleId: module.id,
    selector: 'cartable-wr-w4PreFinal',
    templateUrl: './cartable-wr-w4prefinal.template.html',
    styleUrls: ['./cartable-wr-w4prefinal.component.css','../../../assets/css/dashboard.css'],
    providers: [WorkerMgmService, CartableService]

})

export class CartableWorkerWait4PreFinalComponent {

    activeLabel: string = this.shared.wait4PreFinal;
    loading: boolean = false;
    hmsgs: GrowlMessage[] = [];
    imsgs: Message[] = [];
    errorCntrler: HandleErrorMsg;
    baseImagePath: string;

    stat: CartableSummary = new CartableSummary();
    worker: Worker = new Worker();
    workerID: number;
    selectedWorker: Worker = new Worker();
    workers: Worker[] = [];

    selectedImagePath: string;
    displayImageDialog: boolean = false;
    displayWorkerView: boolean = false;
    displayWorkerEditDialog: boolean = false;

    wrCartableLabel: string = "";

    selectedImageCatalog: any;
    displayCatalogImageDialog: boolean = false;

    workerPhone: WorkerPhone = new WorkerPhone();
    panelWorker: Worker = new Worker();
    newWorkerPhone: boolean = false;
    displayWorkerPhoneDialog: boolean;

    numOfTotalWrCbEntries: number = 0;
    displayWorkerCartable: boolean = false;;
    basicData: BasicData;

    loadingDialog: boolean = false;

    editCapable: boolean = false;
    selectedWorkerID: number = 0;

    constructor(private _router: Router,
        public shared: SharedValues,
        private confirmationService: ConfirmationService,
        private _workerService: WorkerMgmService,
        private _CartableService: CartableService) {

    }
    ngOnInit() {
        this.errorCntrler = new HandleErrorMsg(this._router);
        this.baseImagePath = environment.fileServerUrl;
        this.basicData = JSON.parse(localStorage.getItem('basicData'));

        let loggedInRole = Number(sessionStorage.getItem("roleId"));
        this.editCapable = false;
        if (loggedInRole == UserRoleEnum.SysAdmin || loggedInRole == UserRoleEnum.Operator_H)
            this.editCapable = true;

        this.showPreFinalWorkerCartabl();
    }
    



 
    showPreFinalWorkerCartabl() {
        this.loading = true;
        this._CartableService.getPreFinalWorkers().subscribe(response => {
            this.workers = <Worker[]>response;
            this.wrCartableLabel = this.shared.wait4PreFinal;
            this.loading = false;
        }, error => {
            this.loading = false;
            let obj: Worker[] = error.error;
            let err: BackendMessage = obj[0].error;
            this.parseError(error.status, err);
        });
    }

    closeViewDialog() {
        this.displayWorkerView = false;
    }

    showWorkerEditDialog(worker: Worker) {
        this.worker = worker;
        this.workerID = worker.id;
        let _workers = [...this.workers];
        this._workerService.lookupById(worker.id)
            .subscribe(response => {
                this.worker = <Worker>response;
                this.displayWorkerEditDialog = true;
                let _index = this.findWorkerIndex(_workers, this.worker);
                _workers[_index] = this.worker;
                this.workers = _workers;
            }
                , error => {
                    this.displayWorkerEditDialog = false;
                    let obj: Worker = error.error;
                    let err: BackendMessage = obj.error;
                    this.parseError(error.status, err);
                }
            );
    }


    closeWorkerEditDialog() {
        this.displayWorkerEditDialog = false;

    }

    onSaveWorkerPanel(event) {
        let ws: Worker = event;
        let __workers = [...this.workers];
        let _index = this.findWorkerIndex(this.workers, ws);
        __workers[_index] = ws;
        this.workers = __workers;

        this.displayWorkerEditDialog = false;
        this.hmsgs = [];
        this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
    }
    onSaveWorkerPanelNonClose(event) {
        let ws: Worker = event;
        let __workers = [...this.workers];
        let _index = this.findWorkerIndex(this.workers, ws);
        __workers[_index] = ws;
        this.workers = __workers;
        this.worker = ws;
    }

    onCloseWorkerEditDialog(event) {
        this.displayWorkerEditDialog = false;
    }
    onErrorWorkStationEditPanel(event) {
        this.hmsgs.push({ severity: 'error', summary: '', detail: event });
    }
    onDisplayCatalogImageDialog(event) {
        this.displayCatalogImageDialog = true;
        console.log(event);
        this.selectedImageCatalog = event;
    }
    onUploadBizInfoPanel(event) {
        this.hmsgs.push({ severity: 'info', summary: '', detail: event });
    }

    onShowWorkerPhoneDialogToAdd(event) {
        try {
            let ws: Worker = event;
            this.workerPhone = new WorkerPhone();
            this.panelWorker = new Worker();
            this.panelWorker.id = ws.id;
            this.panelWorker.workerPhones = [];
            this.newWorkerPhone = true;
            this.displayWorkerPhoneDialog = true;
        }
        catch (e) {
            console.log(e);
        }
    }
    onShowWorkerPhoneDialogToEdit(event) {
        let ws: Worker = event;
        this.workerPhone = this.CloneWorkerPhone(ws.workerPhones[0]);
        this.panelWorker = new Worker();
        this.panelWorker.id = ws.id;
        this.panelWorker.workerPhones = [];
        this.newWorkerPhone = false;
        this.displayWorkerPhoneDialog = true;


    }
    onCloseWorkerPhoneInfoPanel(event) {
        this.displayWorkerPhoneDialog = event;
    }
    onErrorWorkerPhoneInfoPanel(event) {
        this.hmsgs.push({ severity: 'error', summary: '', detail: event });
        this.displayWorkerPhoneDialog = false;
    }
    onSaveWorkerPhoneInfoPanel(event) {
        let ws: Worker = event;
        let __workers = [...this.workers];
        let _index = this.findWorkerIndex(this.workers, ws);
        __workers[_index] = ws;
        this.workers = __workers;
        this.selectedWorker.workerPhones = [];
        ws.workerPhones.forEach(element => {
            this.selectedWorker.workerPhones.push(element);
        });
        this.worker = ws;
        this.displayWorkerPhoneDialog = false;
        this.hmsgs = [];
        this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });

    }
    CloneWorkerPhone(wp: WorkerPhone) {
        let workerPhone = new WorkerPhone();
        for (let prop in wp) {
            workerPhone[prop] = wp[prop];
        }
        return workerPhone;
    }


    onShowImage(event) {
        this.displayImageDialog = true;
        this.selectedImagePath = event;
    }


    showWRDocImage(doc: WorkerDocument) {
        this.displayImageDialog = true;
        this.selectedImagePath = doc.photo;
    }
    showUserProfileImage(userProfile: User) {
        this.displayImageDialog = true;
        this.selectedImagePath = userProfile.photo;
    }



    showViewDialog(worker: Worker) {
        this.selectedWorkerID = worker.id;
        this.displayWorkerView = true;
    }
  

    findWorkerIndex(list: Worker[], wo: Worker): number {
        for (let i = 0; i < list.length; i++) {
            let element: Worker = list[i];
            if (element.id == wo.id)
                return i;
        }
    }

    findWorkerDocumentIndex(list: WorkerDocument[], doc: WorkerDocument): number {
        for (let i = 0; i < list.length; i++) {
            let element: WorkerDocument = list[i];
            if (element.id == doc.id)
                return i;
        }
    }
    findUserIndex(list: User[], doc: User): number {
        for (let i = 0; i < list.length; i++) {
            let element: User = list[i];
            if (element.id == doc.id)
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


    

    deleteWorker(worker: Worker) {
        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                //this.loading = true;
                this._workerService.deleteWorker(worker)
                    .subscribe(response => {
                        //this.loading = false;
                        let index = this.findWorkerIndex(this.workers, worker);
                        this.workers = this.workers.filter((val, i) => i != index);
                        this.hmsgs = [];
                        this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
                    },
                        error => {
                            let err: BackendMessage = error.error;
                            this.parseError(error.status, err);
                        });
            }
        });

    }

}