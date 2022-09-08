import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { Message } from 'primeng/components/common/api';
import { ConfirmationService } from 'primeng/primeng';
import { forkJoin } from 'rxjs';
import { CartableSummary } from '../../entities/cartableSummary.class';
import { GrowlMessage } from '../../entities/growlMessage.class';
import { BackendMessage } from '../../entities/Msg.class';
import { PhoneType } from '../../entities/phoneType.class';
import { User } from '../../entities/user.class';
import { WorkerStationCatalog } from '../../entities/workerStationCatalog.class';
import { WorkerStationDocument } from '../../entities/workerStationDocument.class';
import { WorkStation } from '../../entities/workStation.class';
import { WorkStationPhone } from '../../entities/workStationPhone.class';
import { UserRoleEnum } from '../../enums/userRole.enum';
import { CartableService } from '../../services/cartable.service';
import { SharedValues } from '../../services/shared-values.service';
import { WorkerStationMgmService } from '../../services/workerStationMgm.service';
import { HandleErrorMsg } from '../../shared/handleError.class';
import { BasicData } from './../../entities/basicData.class';


@Component({
    moduleId: module.id,
    selector: 'cartable-ws-w4Doc',
    templateUrl: './cartable-ws-w4doc.template.html',
    styleUrls: ['./cartable-ws-w4doc.component.css', '../../../assets/css/dashboard.css'],
    providers: [WorkerStationMgmService, CartableService]

})

export class CartableWorkStationWait4DocComponent {

    loading: boolean = false;
    hmsgs: GrowlMessage[] = [];
    imsgs: Message[] = [];
    errorCntrler: HandleErrorMsg;
    baseImagePath: string;

    workStation: WorkStation = new WorkStation();
    workStations: WorkStation[] = [];


    selectedImagePath: string;
    displayImageDialog: boolean = false;
    displayWorkStationDetailDialog: boolean = false;
    displayWorkStationEditDialog: boolean = false;

    wsCartableLabel: string = "";

    displayDashboard: boolean = false;
    selectedImageCatalog: any;
    displayCatalogImageDialog: boolean = false;
    displayWorkStationPhoneDialog: boolean;
    workStationPhone: WorkStationPhone = new WorkStationPhone();
    panelWorkStation: WorkStation = new WorkStation();
    newWorkStationPhone: boolean = false;

    displayWorkstationCartable: boolean = true;

    basicData: BasicData;

    loadingDialog: boolean = false;
    stat: CartableSummary = new CartableSummary();
    editCapable: boolean = false;

    constructor(private _router: Router, 
        public shared: SharedValues,
        private confirmationService: ConfirmationService,
        private _WorkerStationMgmService: WorkerStationMgmService,
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

        this.showWorkStationWait4DocCartabl();
    }

    showWorkStationWait4DocCartabl() {
        this.loading = true;
        forkJoin(this._CartableService.getWsW4Doc(), this._CartableService.getWsW4Area()).subscribe(response => {
            if (response) {
                let workStationsWait4Doc = <WorkStation[]>response[0];
                let workStationsWait4Area = <WorkStation[]>response[1];
                workStationsWait4Doc.forEach(ws => {
                    this.workStations.push(ws);
                });
                workStationsWait4Area.forEach(ws => {
                    if (!this.workStations.find(workstation => workstation.id == ws.id))
                        this.workStations.push(ws);
                });
                this.wsCartableLabel = this.shared.nwsw4DocAreaCartableLabel;
                this.loading = false;
            }
        }, error => {
            this.loading = false;
            let obj: WorkStation[] = error.error;
            let err: BackendMessage = obj[0].error;
            this.parseError(error.status, err);
        });
    }

    closeWorkStationViewDialog() {
        this.displayWorkStationDetailDialog = false;
    }

    showWorkStationEditDialog(workStation: WorkStation) {
        this.workStation = workStation;
        let __workStations = [...this.workStations];
        this._WorkerStationMgmService.lookupById(workStation.id)
            .subscribe(response => {
                this.workStation = <WorkStation>response;
                this.displayWorkStationEditDialog = true;
                let _index = this.findWorkStationIndex(__workStations, this.workStation);
                __workStations[_index] = this.workStation;
                this.workStations = __workStations;
            }
                , error => {
                    this.displayWorkStationEditDialog = false;
                    let obj: WorkStation = error.error;
                    let err: BackendMessage = obj.error;
                    this.parseError(error.status, err);
                }
            );
    }


    closeWorkStationEditDialog() {
        this.displayWorkStationEditDialog = false;
    }

    onSaveWorkStationPanel(event) {
        let ws: WorkStation = event;
        let __workStations = [...this.workStations];
        let _index = this.findWorkStationIndex(this.workStations, ws);
        __workStations[_index] = ws;
        this.workStations = __workStations;

        this.displayWorkStationEditDialog = false;
        this.hmsgs = [];
        this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
    }


    onCloseWorkStationEditDialog(event) {
        this.displayWorkStationEditDialog = false;
    }

    onErrorWorkStationEditPanel(event) {
        this.hmsgs.push({ severity: 'error', summary: '', detail: event });
    }
    onDisplayCatalogImageDialog(event) {
        this.displayCatalogImageDialog = true;
        this.selectedImageCatalog = event;
    }
    onDisplayDocumentImageDialog(event) {
        let doc: WorkerStationDocument = event;
        this.displayImageDialog = true;
        this.selectedImagePath = doc.photo;
    }
    onUploadBizInfoPanel(event) {
        this.hmsgs.push({ severity: 'info', summary: '', detail: event });
    }
    onShowWorkStationPhoneDialogToAdd(event) {
        try {
            let ws: WorkStation = event;
            this.workStationPhone = new WorkStationPhone();
            this.workStationPhone.phoneType.name = this.basicData.filterPhoneTypeList[0].label;
            this.workStationPhone.phoneType.id = this.basicData.filterPhoneTypeList[0].value;
            this.panelWorkStation = new WorkStation();
            this.panelWorkStation.id = ws.id;
            this.panelWorkStation.title = ws.title;
            this.panelWorkStation.workType = ws.workType;
            this.panelWorkStation.workStationPhones = [];
            this.displayWorkStationPhoneDialog = true;
            this.newWorkStationPhone = true;
        }
        catch (e) {
            console.log(e);
        }
    }
    onShowWorkStationPhoneDialogToEdit(event) {
        let ws: WorkStation = event;
        this.workStationPhone = this.CloneWorkStationPhone(ws.workStationPhones[0]);
        this.panelWorkStation = new WorkStation();
        this.panelWorkStation.id = ws.id;
        this.panelWorkStation.title = ws.title;
        this.panelWorkStation.workType = ws.workType;
        this.panelWorkStation.workStationPhones = [];
        this.displayWorkStationPhoneDialog = true;
        this.newWorkStationPhone = false;

    }


    onDeleteJobCategoryPanel(event) {
        try {
            let ws: WorkStation = event;
            let __workStations = [...this.workStations];
            let _index = this.findWorkStationIndex(this.workStations, ws);
            __workStations[_index] = ws;
            this.workStations = __workStations;
        }
        catch (e) {
            console.log(e);
        }
    }
    onCloseWorkStationPhoneInfoPanel(event) {
        this.displayWorkStationPhoneDialog = event;
    }
    onErrorWorkStationPhoneInfoPanel(event) {
        this.hmsgs.push({ severity: 'error', summary: '', detail: event });
        this.displayWorkStationPhoneDialog = false;
    }
    onSaveWorkStationPhoneInfoPanel(event) {
        let ws: WorkStation = event;
        let __workStations = [...this.workStations];
        let _index = this.findWorkStationIndex(this.workStations, ws);
        __workStations[_index] = ws;
        this.workStations = __workStations;
        this.workStation.workStationPhones = [];
        ws.workStationPhones.forEach(element => {
            this.workStation.workStationPhones.push(element);
        });
        this.workStation = ws;
        this.displayWorkStationPhoneDialog = false;
        this.hmsgs = [];
        this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
    }
    onShowImage(event) {
        this.displayImageDialog = true;
        this.selectedImagePath = event;
    }

    showWSDocImage(doc: WorkerStationDocument) {
        this.displayImageDialog = true;
        this.selectedImagePath = doc.photo;
    }

    showUserProfileImage(userProfile: User) {
        this.displayImageDialog = true;
        this.selectedImagePath = userProfile.photo;
    }
    showWSLogo(ws: WorkStation) {
        this.displayImageDialog = true;
        this.selectedImagePath = ws.logo;
    }
    showWSCatalog(ws: WorkerStationCatalog) {
        this.displayImageDialog = true;
        this.selectedImagePath = ws.photo;
    }
    showWorkStationViewDialog(workStation: WorkStation) {
        this.workStation = workStation;
        let __workStations = [...this.workStations];
        //this.loading = true;
        this._WorkerStationMgmService.lookupById(workStation.id)
            .subscribe(response => {
                this.workStation = <WorkStation>response;
                this.displayWorkStationDetailDialog = true;
                let _index = this.findWorkStationIndex(__workStations, this.workStation);
                __workStations[_index] = this.workStation;
                this.workStations = __workStations;
                //this.loading = false;
            }
                , error => {
                    this.displayWorkStationDetailDialog = false;
                    let obj: WorkStation = error.error;
                    let err: BackendMessage = obj.error;
                    this.parseError(error.status, err);
                    //this.loading = false;
                }
            );
    }

    findWorkStationIndex(list: WorkStation[], ws: WorkStation): number {
        for (let i = 0; i < list.length; i++) {
            let element: WorkStation = list[i];
            if (element.id == ws.id)
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
    findWorkStationCatalogIndex(list: WorkerStationCatalog[], doc: WorkerStationCatalog): number {
        for (let i = 0; i < list.length; i++) {
            let element: WorkerStationCatalog = list[i];
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


    deleteWorkStation(workStation: WorkStation) {

        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                //this.loading = true;
                this._WorkerStationMgmService.deleteWorkStation(workStation)
                    .subscribe(response => {
                        //this.loading = false;
                        let index = this.findWorkStationIndex(this.workStations, workStation);
                        this.workStations = this.workStations.filter((val, i) => i != index);
                    },
                        error => {
                            let err: BackendMessage = error.error;
                            this.parseError(error.status, err);
                        });
            }
        });

    }

    CloneWorkStationPhone(wp: WorkStationPhone) {
        let workStationPhone = new WorkStationPhone();
        for (let prop in wp) {
            workStationPhone[prop] = wp[prop];
            workStationPhone.phoneType = new PhoneType();
            workStationPhone.phoneType.id = wp.phoneType.id;
            workStationPhone.phoneType.name = wp.phoneType.name;
        }
        return workStationPhone;
    }
}