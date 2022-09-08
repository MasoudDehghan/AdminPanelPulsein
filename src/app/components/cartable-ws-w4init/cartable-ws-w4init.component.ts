import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import * as moment from 'jalali-moment';
import { Moment } from 'jalali-moment';
import { Message } from 'primeng/components/common/api';
import { ConfirmationService, SelectItem } from 'primeng/primeng';
import { CartableSearch } from '../../entities/cartableSearch.class';
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
import { VerifySearchEnum } from '../../enums/verifySearch.enum';
import { VerifyState } from '../../enums/verifyState.enum';
import { CartableService } from '../../services/cartable.service';
import { SharedValues } from '../../services/shared-values.service';
import { WorkerStationMgmService } from '../../services/workerStationMgm.service';
import { HandleErrorMsg } from '../../shared/handleError.class';
import { BasicData } from './../../entities/basicData.class';


@Component({
    moduleId: module.id,
    selector: 'cartable-ws-w4Init',
    templateUrl: './cartable-ws-w4Init.template.html',
    styleUrls: ['./cartable-ws-w4Init.component.css','../../../assets/css/dashboard.css'],
    providers: [WorkerStationMgmService, CartableService]

})

export class CartableWorkStationWait4InitComponent {

    loading: boolean = false;
    hmsgs: GrowlMessage[] = [];
    imsgs: Message[] = [];
    errorCntrler: HandleErrorMsg;
    baseImagePath: string;

    workStation: WorkStation = new WorkStation();
    newWorkStations: WorkStation[] = [];


    selectedImagePath: string;
    displayImageDialog: boolean = false;
    displayWorkStationDetailDialog: boolean = false;
    displayWorkStationEditDialog: boolean = false;

    wsCartableLabel: string = "";

    displayDashboard: boolean = false;
    displayHistoryPanel: boolean = false;

    filterForm: FormGroup;
    itemTypeList: SelectItem[] = [];
    selectedItemType: string = VerifySearchEnum.Verify_Search_Ws.toString();
    selectedStartDate: string = null;
    selectedStopDate: string = null;
    selectedVerfyState: number = 1;
    selectedVerifier: User = null;


    chipsFilterValues: string[] = [];
    chipsFilterMap: Map<string, string> = new Map<string, string>();
    filteredItemType: number;
    filteredStartDate: string;
    filteredStopDate: string;
    filteredVerfyState: number;
    filteredVerifier: User;
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
    datePickerConfig = {
        drops: 'down',
        format: 'YYYY/MM/DD HH:mm:ss',
        appendTo: 'body'
    };
    _startDate: Moment;
    _stopDate: Moment;
    constructor(private _router: Router, private _fb: FormBuilder,
        private cdRef: ChangeDetectorRef,
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
        this.filterForm = this._fb.group({
            startDate: [''],
            stopDate: [''],
            verified: [''],
            verifiedBy: [null]
        });
        this.showNewWorkStationCartabl();
    }
    clearFilter() {
        this.chipsFilterMap.clear();
        this.chipsFilterValues = [];
        this.filteredItemType = 0;
        this.filteredStartDate = null;
        this.filteredStopDate = null;
        this.filteredVerfyState = 0;
        this.filteredVerifier = null;
    }


    onSubmitFilterform() {

        let error: boolean = false;
        let cartableSearch: CartableSearch = new CartableSearch();
        if (this._startDate != undefined) {
            this.selectedStartDate = moment(this._startDate).locale('fa').format('YYYY/MM/DD HH:mm:ss');
            if (this.selectedStartDate == null || this.selectedStartDate == undefined || this.selectedStartDate == "") {
                this.imsgs.push({ severity: 'error', summary: '', detail: this.shared.InnerCode_InvalidFilterStartDateMsg });
                error = true;
            }
        }
        if (this._stopDate != undefined) {
            this.selectedStopDate = moment(this._stopDate).locale('fa').format('YYYY/MM/DD HH:mm:ss');

            if (this.selectedStopDate == null || this.selectedStopDate == undefined || this.selectedStopDate == "") {
                this.imsgs.push({ severity: 'error', summary: '', detail: this.shared.InnerCode_InvalidFilterStopDateMsg });
                error = true;
            }
        }
        if (!error) {
            this.clearFilter();
            cartableSearch.start = this.selectedStartDate;
            cartableSearch.end = this.selectedStopDate;
            cartableSearch.searchTypeId = VerifySearchEnum.Verify_Search_Ws;
            cartableSearch.verifyFlag = this.selectedVerfyState;
            cartableSearch.userId = 0;
            if (this.selectedVerifier != null)
                if (this.selectedVerifier.id != 0)
                    cartableSearch.userId = this.selectedVerifier.id;
            this.loading = true;
            this.filteredItemType = VerifySearchEnum.Verify_Search_Ws;;
            this.filteredStartDate = this.selectedStartDate;
            this.filteredStopDate = this.selectedStopDate;
            this.filteredVerfyState = this.selectedVerfyState;
            this.filteredVerifier = this.selectedVerifier;



            this._CartableService.search(cartableSearch).subscribe(response => {
                let result = response;
                this.newWorkStations = <WorkStation[]>result;

                this.wsCartableLabel = this.shared.wsCartableLabel;
                this.chipsFilterMap.set(this.shared.wsCartableLabel, "filteredItemType");
                this.chipsFilterValues.push(this.shared.wsCartableLabel + " : " + this.shared.wsNew);
                this.loading = false;

                this.chipsFilterMap.set("filteredStartDate", "filteredStartDate");
                this.chipsFilterValues.push(this.shared.startWorkingHourLabel + " : " + this.filteredStartDate);

                this.chipsFilterMap.set("filteredStopDate", "filteredStopDate");
                this.chipsFilterValues.push(this.shared.stopWorkingHourLabel + " : " + this.filteredStopDate);

                this.chipsFilterMap.set("filteredVerfyState", "filteredVerfyState");
                if (this.filteredVerfyState == 1)
                    this.chipsFilterValues.push(this.shared.state + " : " + this.shared.acceptLabel);
                else if (this.filteredVerfyState == 2)
                    this.chipsFilterValues.push(this.shared.state + " : " + this.shared.rejectLabel);
                if (this.filteredVerifier != null) {
                    this.chipsFilterMap.set("filteredVerifier", "filteredVerifier");
                    this.chipsFilterValues.push(this.shared.verifierWsUserName + " : " + this.filteredVerifier.firstName + " " + this.filteredVerifier.lastName);
                }

            }, error => {
                let err: BackendMessage = error.error;
                this.parseError(error.status, err);
            })
        }
    }

    showNewWorkStationCartabl() {
        this.loading = true;
        this._CartableService.getNewWorkStations().subscribe(response => {
            this.newWorkStations = <WorkStation[]>response;
            this.wsCartableLabel = this.shared.nwsCartableLabel;
            this.loading = false;
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
        let __workStations = [...this.newWorkStations];
        this._WorkerStationMgmService.lookupById(workStation.id)
            .subscribe(response => {
                this.workStation = <WorkStation>response;
                this.displayWorkStationEditDialog = true;
                let _index = this.findWorkStationIndex(__workStations, this.workStation);
                __workStations[_index] = this.workStation;
                this.newWorkStations = __workStations;
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
        let __workStations = [...this.newWorkStations];
        let _index = this.findWorkStationIndex(this.newWorkStations, ws);
        __workStations[_index] = ws;
        this.newWorkStations = __workStations;

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
            let __workStations = [...this.newWorkStations];
            let _index = this.findWorkStationIndex(this.newWorkStations, ws);
            __workStations[_index] = ws;
            this.newWorkStations = __workStations;
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
        let __workStations = [...this.newWorkStations];
        let _index = this.findWorkStationIndex(this.newWorkStations, ws);
        __workStations[_index] = ws;
        this.newWorkStations = __workStations;
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
        let __workStations = [...this.newWorkStations];
        //this.loading = true;
        this._WorkerStationMgmService.lookupById(workStation.id)
            .subscribe(response => {
                this.workStation = <WorkStation>response;
                this.displayWorkStationDetailDialog = true;
                let _index = this.findWorkStationIndex(__workStations, this.workStation);
                __workStations[_index] = this.workStation;
                this.newWorkStations = __workStations;
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



    showHistoryPanel() {
        this.displayHistoryPanel = true;
        this.cdRef.detectChanges();


    }
    closeHistoryDialog() {
        this.displayHistoryPanel = false;
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

    handleWorkstationRegistration(workstation: WorkStation, state: VerifyState) {
        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                this.loading = true;
                workstation.verified = state;
                this._CartableService.verifyWorkStationFirst(workstation).subscribe(response => {
                    let index = this.findWorkStationIndex(this.newWorkStations, workstation);
                    this.newWorkStations = this.newWorkStations.filter((val, i) => i != index);
                    this.hmsgs = [];
                    this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
                    this.loading = false;
                }, error => {
                    let err: BackendMessage = error.error;
                    this.parseError(error.status, err);
                    this.loading = false;
                })
            }
        });
    }



    onRemoveFilter() {
        this.clearFilter();
        this.showNewWorkStationCartabl();
    }
    deleteWorkStation(workStation: WorkStation) {

        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                //this.loading = true;
                this._WorkerStationMgmService.deleteWorkStation(workStation)
                    .subscribe(response => {
                        //this.loading = false;
                        let index = this.findWorkStationIndex(this.newWorkStations, workStation);
                        this.newWorkStations = this.newWorkStations.filter((val, i) => i != index);
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