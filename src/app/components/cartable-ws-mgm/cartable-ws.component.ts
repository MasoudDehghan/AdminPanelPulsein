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
    selector: 'cartable-ws',
    templateUrl: './cartable-ws.template.html',
    styleUrls: ['./cartable-ws.component.css'],
    providers: [WorkerStationMgmService, CartableService]

})

export class CartableWorkStationComponent {

    activeLabel: string = this.shared.wsCartableLabel;
    loading: boolean = false;
    hmsgs: GrowlMessage[] = [];
    imsgs: Message[] = [];
    errorCntrler: HandleErrorMsg;
    baseImagePath: string;

    workStation: WorkStation = new WorkStation();
   
    newWorkerStationDocuments: WorkerStationDocument[] = [];
    newWorkStationsLogo: WorkStation[] = [];
    newWorkStationsCatalog: WorkerStationCatalog[] = [];

    selectedImagePath: string;
    displayImageDialog: boolean = false;
    displayWorkStationDetailDialog: boolean = false;
    displayWorkStationEditDialog: boolean = false;

    wsCartableLabel: string = "";
    wsDocumentCartablLabel: string = "";
    wsLogosCartablLabel: string = "";
    wsCatalogsCartablLabel: string = "";
    displayDashboard: boolean = false;
    displayHistoryPanel: boolean = false;
    displayNewWSDocs: boolean = false;
    displayNewWSLogos: boolean = false;
    displayNewWSCatalogs: boolean = false;

    filterForm: FormGroup;
    itemTypeList: SelectItem[] = [];
    selectedItemType: string = VerifySearchEnum.Verify_Search_WsD.toString();
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
        appendTo:'body'
    };
    _startDate: Moment;
    _stopDate: Moment;
    constructor(private _router: Router, private _fb: FormBuilder,
        private cdRef: ChangeDetectorRef,
        public shared: SharedValues,
        private confirmationService: ConfirmationService,
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
        this.initItemTypeList();
        this.filterForm = this._fb.group({
            itemType: [''],
            startDate: [''],
            stopDate: [''],
            verified: [''],
            verifiedBy: [null]
        });
        this.showWorkStationCartableDashboard();
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

    showWorkStationCartableDashboard() {
        this.setToDefaultFlags();
        this.loading = true;
        this._CartableService.getSummary().subscribe(response => {
            this.stat = <CartableSummary>response;
            this.displayWorkstationCartable = true;
            this.loading = false;
        }, error => {
            this.loading = false;
            let obj: CartableSummary = error.error;
            let err: BackendMessage = obj.error;
            this.parseError(error.status, err);
        });
    }

    setToDefaultFlags() {
        this.displayDashboard = false;
        this.displayHistoryPanel = false;
        this.displayNewWSDocs = false;

        this.displayNewWSLogos = false;
        this.displayNewWSCatalogs = false;
        this.displayWorkStationEditDialog = false;
        this.displayWorkstationCartable = false;

    }
    initItemTypeList() {
        this.itemTypeList = [
            { label: this.shared.wsDocument, value: VerifySearchEnum.Verify_Search_WsD.toString() },
            { label: this.shared.wsLogo, value: VerifySearchEnum.Verify_Search_WsL.toString() },
            { label: this.shared.wsCatalog, value: VerifySearchEnum.Verify_Search_WsC.toString() }
        ];

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
            this.setToDefaultFlags();
            this.clearFilter();
            cartableSearch.start = this.selectedStartDate;
            cartableSearch.end = this.selectedStopDate;
            cartableSearch.searchTypeId = Number.parseInt(this.selectedItemType);
            cartableSearch.verifyFlag = this.selectedVerfyState;
            cartableSearch.userId = 0;
            if (this.selectedVerifier != null)
                if (this.selectedVerifier.id != 0)
                    cartableSearch.userId = this.selectedVerifier.id;
            this.loading = true;
            this.filteredItemType = Number.parseInt(this.selectedItemType);
            this.filteredStartDate = this.selectedStartDate;
            this.filteredStopDate = this.selectedStopDate;
            this.filteredVerfyState = this.selectedVerfyState;
            this.filteredVerifier = this.selectedVerifier;



            this._CartableService.search(cartableSearch).subscribe(response => {
                let result = response;
                switch (cartableSearch.searchTypeId) {



                    case VerifySearchEnum.Verify_Search_WsD:
                        let _newWorkerStationDocuments: WorkerStationDocument[] = <WorkerStationDocument[]>response;
                        _newWorkerStationDocuments.forEach(doc => {
                            doc.photo = this.baseImagePath + "/" + doc.photo;
                            this.newWorkerStationDocuments.push(doc);
                        });
                        this.setToDefaultFlags();
                        this.displayNewWSDocs = true;
                        this.wsDocumentCartablLabel = this.shared.wsDocumentCartablLabel;
                        this.chipsFilterMap.set(this.shared.wsDocumentCartablLabel, "filteredItemType");
                        this.chipsFilterValues.push(this.shared.wsDocumentCartablLabel + " : " + this.shared.wsDocument);
                        this.loading = false;
                        break;
                    case VerifySearchEnum.Verify_Search_WsL:
                        let _l: WorkStation[] = <WorkStation[]>response;
                        _l.forEach(ws => {
                            ws.logo = this.baseImagePath + "/" + ws.logo;
                            this.newWorkStationsLogo.push(ws);
                        });
                        this.setToDefaultFlags();
                        this.displayNewWSLogos = true;
                        this.wsLogosCartablLabel = this.shared.wsLogosCartablLabel;
                        this.chipsFilterMap.set(this.shared.wsLogosCartablLabel, "filteredItemType");
                        this.chipsFilterValues.push(this.shared.wsLogosCartablLabel + " : " + this.shared.wsLogo);
                        this.loading = false;
                        break;
                    case VerifySearchEnum.Verify_Search_WsC:
                        let _newWorkStationsCatalogs: WorkerStationCatalog[] = <WorkerStationCatalog[]>response;
                        _newWorkStationsCatalogs.forEach(ws => {
                            ws.photo = this.baseImagePath + "/" + ws.photo;
                            this.newWorkStationsCatalog.push(ws);
                        });
                        this.setToDefaultFlags();
                        this.displayNewWSCatalogs = true;
                        this.wsCatalogsCartablLabel = this.shared.wsCatalogsCartablLabel;
                        this.chipsFilterMap.set(this.shared.wsCatalogsCartablLabel, "filteredItemType");
                        this.chipsFilterValues.push(this.shared.wsCatalogsCartablLabel + " : " + this.shared.wsCatalog);
                        this.loading = false;
                        break;
                    default:
                        this.loading = false;
                        break;
                }
                this.chipsFilterMap.set("filteredStartDate", "filteredStartDate");
                this.chipsFilterValues.push(this.shared.startWorkingHourLabel + " : " + this.filteredStartDate);

                this.chipsFilterMap.set("filteredStopDate", "filteredStopDate");
                this.chipsFilterValues.push(this.shared.stopWorkingHourLabel + " : " + this.filteredStopDate);

                this.chipsFilterMap.set("filteredVerfyState", "filteredVerfyState");
                if (this.filteredVerfyState == 1)
                    this.chipsFilterValues.push(this.shared.state + " : " + this.shared.acceptLabel);
                else if (this.filteredVerfyState == 2)
                    this.chipsFilterValues.push(this.shared.state + " : " + this.shared.rejectLabel);
                console.log(this.filteredVerifier);
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

   
    showNewWSDocsCartabl() {
        this.loading = true;
        this.newWorkerStationDocuments = [];
        this._CartableService.getWorkStationDocument().subscribe(response => {
            let _newWorkerStationDocuments: WorkerStationDocument[] = <WorkerStationDocument[]>response;
            _newWorkerStationDocuments.forEach(doc => {
                doc.photo = this.baseImagePath + "/" + doc.photo;
                this.newWorkerStationDocuments.push(doc);
            });
            this.setToDefaultFlags();
            this.displayNewWSDocs = true;
            this.wsDocumentCartablLabel = this.shared.nwsDocumentCartablLabel;
            this.loading = false;
        }, error => {
            this.loading = false;
            let obj: WorkerStationDocument[] = error.error;
            let err: BackendMessage = obj[0].error;
            this.parseError(error.status, err);
        });
    }

    showNewWSLogoCartabl() {
        this.loading = true;
        this.newWorkStationsLogo = [];
        this._CartableService.getWorkStationLogo().subscribe(response => {
            let _newWorkStationsLogo = <WorkStation[]>response;
            _newWorkStationsLogo.forEach(ws => {
                ws.logo = this.baseImagePath + "/" + ws.logo;
                this.newWorkStationsLogo.push(ws);
            });
            this.setToDefaultFlags();
            this.displayNewWSLogos = true;
            this.wsLogosCartablLabel = this.shared.wsNewLogosCartablLabel;
            this.loading = false;
        }, error => {
            this.loading = false;
            let obj: WorkStation[] = error.error;
            let err: BackendMessage = obj[0].error;
            this.parseError(error.status, err);
        });
    }
    showNewWSCatalogCartabl() {
        this.loading = true;
        this.newWorkStationsCatalog = [];
        this._CartableService.getWorkStationCatalog().subscribe(response => {
            let _newWorkStationsCatalog = <WorkerStationCatalog[]>response;
            _newWorkStationsCatalog.forEach(ws => {
                ws.photo = this.baseImagePath + "/" + ws.photo;
                this.newWorkStationsCatalog.push(ws);
            });
            this.setToDefaultFlags();
            this.displayNewWSCatalogs = true;
            this.wsCatalogsCartablLabel = this.shared.wsNewCatalogsCartablLabel;
            this.loading = false;
        }, error => {
            this.loading = false;
            let obj: WorkerStationCatalog[] = error.error;
            let err: BackendMessage = obj[0].error;
            this.parseError(error.status, err);
        });

    }

    closeWorkStationViewDialog() {
        this.displayWorkStationDetailDialog = false;
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

    findWorkerStationDocumentIndex(list: WorkerStationDocument[], doc: WorkerStationDocument): number {
        for (let i = 0; i < list.length; i++) {
            let element: WorkerStationDocument = list[i];
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

 

 

    handleWorkstationDocuments(doc: WorkerStationDocument, state: VerifyState) {
        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                this.loading = true;
                doc.verifyFlag = state;
                this._CartableService.verifyWorkStationDoc(doc).subscribe(response => {
                    let index = this.findWorkerStationDocumentIndex(this.newWorkerStationDocuments, doc);
                    this.newWorkerStationDocuments = this.newWorkerStationDocuments.filter((val, i) => i != index);
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

    handleWorkStationLogo(workstation: WorkStation, state: VerifyState) {

        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                this.loading = true;
                workstation.logoVerified = state;
                this._CartableService.verifyWorkStationLogo(workstation).subscribe(response => {
                    let index = this.findWorkStationIndex(this.newWorkStationsLogo, workstation);
                    this.newWorkStationsLogo = this.newWorkStationsLogo.filter((val, i) => i != index);
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
    handleWorkStationCatalog(workstationCatalog: WorkerStationCatalog, state: VerifyState) {
        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                this.loading = true;
                workstationCatalog.verifyFlag = state;
                this._CartableService.verifyWorkStationCat(workstationCatalog).subscribe(response => {
                    let index = this.findWorkStationCatalogIndex(this.newWorkStationsCatalog, workstationCatalog);
                    this.newWorkStationsCatalog = this.newWorkStationsCatalog.filter((val, i) => i != index);
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
        this.showWorkStationCartableDashboard();
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