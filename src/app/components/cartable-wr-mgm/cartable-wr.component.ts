import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'jalali-moment';
import { Moment } from 'jalali-moment';
import { Message } from 'primeng/components/common/api';
import { ConfirmationService, SelectItem } from 'primeng/primeng';
import { CartableSearch } from '../../entities/cartableSearch.class';
import { CartableSummary } from '../../entities/cartableSummary.class';
import { GrowlMessage } from '../../entities/growlMessage.class';
import { BackendMessage } from '../../entities/Msg.class';
import { User } from '../../entities/user.class';
import { Worker } from '../../entities/worker.class';
import { WorkerDocument } from '../../entities/workerDocument.class';
import { WorkerPhone } from '../../entities/workerPhone.class';
import { UserRoleEnum } from '../../enums/userRole.enum';
import { VerifySearchEnum } from '../../enums/verifySearch.enum';
import { VerifyState } from '../../enums/verifyState.enum';
import { CartableService } from '../../services/cartable.service';
import { SharedValues } from '../../services/shared-values.service';
import { WorkerMgmService } from '../../services/workerMgm.service';
import { HandleErrorMsg } from '../../shared/handleError.class';
import { environment } from './../../../environments/environment';
import { BasicData } from './../../entities/basicData.class';


@Component({
    moduleId: module.id,
    selector: 'cartable',
    templateUrl: './cartable-wr.template.html',
    styleUrls: ['./cartable-wr.component.css'],
    providers: [WorkerMgmService, CartableService]

})

export class CartableWorkerComponent {

    activeLabel: string = this.shared.wrCartableLabel;
    loading: boolean = false;
    hmsgs: GrowlMessage[] = [];
    imsgs: Message[] = [];
    errorCntrler: HandleErrorMsg;
    baseImagePath: string;

    stat: CartableSummary = new CartableSummary();
    worker: Worker = new Worker();
    workerID: number;
    selectedWorker: Worker = new Worker();
    newWorkerDocuments: WorkerDocument[] = [];
    newUsersProfile: User[] = [];

    selectedImagePath: string;
    displayImageDialog: boolean = false;
    wrCartableLabel: string = "";
    wrDocumentCartablLabel: string = "";
    wrUsersProfileCartablLabel: string = "";
    displayDashboard: boolean = false;
    displayHistoryPanel: boolean = false;
    displayNewWRDocs: boolean = false;
    displayNewWorkerProfiles: boolean = false;

    filterForm: FormGroup;
    itemTypeList: SelectItem[] = [];
    selectedItemType: string = VerifySearchEnum.Verify_Search_WrD.toString();;
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
    datePickerConfig = {
        drops: 'down',
        format: 'YYYY/MM/DD HH:mm:ss',
        appendTo:'body'
    };
    _updateStartDate: Moment;
    _updateStopDate: Moment;
    constructor(private _router: Router, private _fb: FormBuilder,
        private cdRef: ChangeDetectorRef,
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
        this.initItemTypeList();
        this.filterForm = this._fb.group({
            itemType: [''],
            startDate: [''],
            stopDate: [''],
            verified: [''],
            verifiedBy: [null]
        });
        this.showWorkerCartableDashboard();
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



    showWorkerCartableDashboard() {
        this.setToDefaultFlags();
        this.loading = true;
        this._CartableService.getSummary().subscribe(response => {
            this.stat = <CartableSummary>response;
            this.displayWorkerCartable = true;
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
        this.displayNewWRDocs = false;
        this.displayNewWorkerProfiles = false;
        this.displayWorkerCartable = false;
    }
    initItemTypeList() {
        this.itemTypeList = [];
        this.itemTypeList.push({ label: this.shared.wrDocument, value: VerifySearchEnum.Verify_Search_WrD.toString() });
        this.itemTypeList.push({ label: this.shared.wrProfileImage, value: VerifySearchEnum.Verify_Search_User.toString() });

    }

    onSubmitFilterform() {

        let error: boolean = false;
        let cartableSearch: CartableSearch = new CartableSearch();
        if (this._updateStartDate != undefined) {
            this.selectedStartDate = moment(this._updateStartDate).locale('fa').format('YYYY/MM/DD HH:mm:ss');
            if (this.selectedStartDate == null || this.selectedStartDate == undefined || this.selectedStartDate == "") {
                this.imsgs.push({ severity: 'error', summary: '', detail: this.shared.InnerCode_InvalidFilterStartDateMsg });
                error = true;
            }
        }
        if (this._updateStopDate != undefined) {
            this.selectedStopDate = moment(this._updateStopDate).locale('fa').format('YYYY/MM/DD HH:mm:ss');
            if (this.selectedStopDate == null || this.selectedStopDate == undefined || this.selectedStopDate == "") {
                this.imsgs.push({ severity: 'error', summary: '', detail: this.shared.InnerCode_InvalidFilterStopDateMsg });
                error = true;
            }
        }

        if (!error) {
            this.setToDefaultFlags();
            this.clearFilter();
            this.newWorkerDocuments = [];
            this.newUsersProfile = [];
            this.newUsersProfile = [];
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

                    case VerifySearchEnum.Verify_Search_WrD:
                        let _newWorkerDocuments: WorkerDocument[] = <WorkerDocument[]>response;
                        _newWorkerDocuments.forEach(doc => {
                            doc.photo = this.baseImagePath + "/" + doc.photo;
                            this.newWorkerDocuments.push(doc);
                        });
                        this.setToDefaultFlags();
                        this.displayNewWRDocs = true;
                        this.wrDocumentCartablLabel = this.shared.wrDocumentCartablLabel;
                        this.chipsFilterMap.set(this.shared.wrDocumentCartablLabel, "filteredItemType");
                        this.chipsFilterValues.push(this.shared.wrDocumentCartablLabel + " : " + this.shared.wrDocument);
                        this.loading = false;
                        break;


                    case VerifySearchEnum.Verify_Search_User:
                        let _newUsersProfile: User[] = <User[]>response;
                        _newUsersProfile.forEach(user => {
                            user.photo = this.baseImagePath + "/" + user.photo;
                            this.newUsersProfile.push(user);
                        });
                        this.setToDefaultFlags();
                        this.displayNewWorkerProfiles = true;
                        this.wrUsersProfileCartablLabel = this.shared.wrUsersProfileCartablLabel;
                        this.chipsFilterMap.set(this.shared.wrUsersProfileCartablLabel, "filteredItemType");
                        this.chipsFilterValues.push(this.shared.wrUsersProfileCartablLabel + " : " + this.shared.wrProfileImage);
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

                this.chipsFilterMap.set("filteredVerifier", "filteredVerifier");
                this.chipsFilterValues.push(this.shared.verifierWsUserName + " : " + this.filteredVerifier.firstName + " " + this.filteredVerifier.lastName);

            }, error => {
                let err: BackendMessage = error.error;
                this.parseError(error.status, err);
            })
        }
    }

    
    showNewWRDocsCartabl() {
        this.loading = true;
        this.newWorkerDocuments = [];
        this._CartableService.getWorkerDocument().subscribe(response => {
            let _newWorkerDocuments = <WorkerDocument[]>response;
            _newWorkerDocuments.forEach(doc => {
                doc.photo = this.baseImagePath + "/" + doc.photo;
                this.newWorkerDocuments.push(doc);
            });
            this.setToDefaultFlags();
            this.displayNewWRDocs = true;
            this.wrDocumentCartablLabel = this.shared.nwrDocumentCartablLabel;
            this.loading = false;
        }, error => {
            this.loading = false;
            let obj: WorkerDocument[] = error.error;
            let err: BackendMessage = obj[0].error;
            this.parseError(error.status, err);
        });
    }
    showNewWRProfileCartabl() {
        this.loading = true;
        this.newUsersProfile = [];
        this._CartableService.getNewUserProfile().subscribe(response => {
            let _newUsersProfile = <User[]>response;
            _newUsersProfile.forEach(usr => {
                usr.photo = this.baseImagePath + "/" + usr.photo;
                this.newUsersProfile.push(usr);
            });
            this.setToDefaultFlags();
            this.displayNewWorkerProfiles = true;
            this.wrUsersProfileCartablLabel = this.shared.wrNewUsersProfileCartablLabel;
            this.loading = false;
        }, error => {
            this.loading = false;
            let obj: User[] = error.error;
            let err: BackendMessage = obj[0].error;
            this.parseError(error.status, err);
        });
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



    showHistoryPanel() {
        this.displayHistoryPanel = true;
        this.cdRef.detectChanges();

    }
    closeHistoryDialog() {
        this.displayHistoryPanel = false;
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



    handleWorkerDocuments(doc: WorkerDocument, state: VerifyState) {

        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                this.loading = true;
                doc.verifyFlag = state;
                this._CartableService.verifyWorkerDoc(doc).subscribe(response => {
                    let index = this.findWorkerDocumentIndex(this.newWorkerDocuments, doc);
                    this.newWorkerDocuments = this.newWorkerDocuments.filter((val, i) => i != index);
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
    handleUsersProfile(user: User, state: VerifyState) {

        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                this.loading = true;
                user.verified = state;
                this._CartableService.verifyUser(user).subscribe(response => {
                    let index = this.findUserIndex(this.newUsersProfile, user);
                    this.newUsersProfile = this.newUsersProfile.filter((val, i) => i != index);
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
        this.showWorkerCartableDashboard();
    }


}