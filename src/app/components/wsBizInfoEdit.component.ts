import { Component, Input, Output, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core'
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'

import { WorkStation } from '../entities/workStation.class'
import { WorkTypeEnum } from '../enums/workType.enum'
import { WorkerStationMgmService } from '../services/workerStationMgm.service'
import { HandleErrorMsg } from '../shared/handleError.class'
import { WorkerStationCatalog } from '../entities/workerStationCatalog.class'
import { BackendMessage } from '../entities/Msg.class'
import { SelectItem } from 'primeng/primeng';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { CustomValidators } from '../shared/custome-validators.class';
import { GrowlMessage } from '../entities/growlMessage.class'
import { SharedValues } from '../services/shared-values.service'
import { environment } from '../../environments/environment';


import * as moment from 'jalali-moment';
import { Moment } from 'jalali-moment';
@Component({
    moduleId: module.id,
    selector: 'wsBizInfoComponent',
    templateUrl: './wsBizInfoEdit.template.html',
    styleUrls: ['../../assets/css/dashboard.css'],
    providers:[WorkerStationMgmService]
})

export class WorkStationBizInfoEdit implements OnInit {
    bizForm: FormGroup;
    @Input() inputWorkStation: WorkStation;
    selectedWorkStation: WorkStation = new WorkStation();
    @Input() editMode: boolean = false;
    @Input() workTypeList: SelectItem[] = [];
    @Input() setupDate: boolean = false;
    @Input() loading: boolean = false;
    @Output() onClose = new EventEmitter<boolean>();
    @Output() onSave = new EventEmitter<WorkStation>();
    @Output() onUploadT = new EventEmitter<string>();
    @Output() onDisplayCatalogImageDialog = new EventEmitter<any>();

    showStorePanel = false;
    showCompanyPanel = false;
    workStation: WorkStation = new WorkStation();
   
    errorCntrler: HandleErrorMsg;
    selectedWorkStationCatalogImgs: any[];
    selectedImageCatalog: any;
    WorkerStationCatalogList: WorkerStationCatalog[] = [];
    uploadedFiles: any[] = [];
    baseImagePath = environment.fileServerUrl;
    uploadURL: string;
    uploadedImageName: string;
    msgs: GrowlMessage[] = [];
    buildFormDone:boolean = false;
    datePickerConfig = {
        drops: 'up',
        format: 'YYYY/MM/DD HH:mm:ss',
        appendTo:'body'
    };
    _storeRegisterDate : Moment;
    _companyRegisterDate : Moment;
    constructor(private _router: Router, private _fb: FormBuilder, private confirmationService: ConfirmationService,
        private cdRef: ChangeDetectorRef, private _dService: WorkerStationMgmService,
        public shared: SharedValues) {

    }
    ngOnInit() {
        //this.loading = true;
        let token: String = sessionStorage.getItem('token');
        this.uploadURL = environment.apiUrl+"/upload/img/" + token;
        this.errorCntrler = new HandleErrorMsg(this._router);
        if(!this.buildFormDone)
            this.buildForm();
        this.cdRef.detectChanges();
        

    }
    ngOnChanges() {
        if(!this.buildFormDone)
            this.buildForm();
        this.initData();
        if(this.setupDate)        
            this.dateSetup();
        
        

    }
    ngAfterViewInit() {
        //this.loading = false;
        if(!this.setupDate)        
            this.dateSetup();
        this.cdRef.detectChanges();

    }
    buildForm(){
        this.bizForm = this._fb.group({
            title: [this.selectedWorkStation.title,
            Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
            CustomValidators.uniqueWorkStationTitleChecker(this._dService)],
            workStationType: [this.selectedWorkStation.workType],
            officeName: [this.selectedWorkStation.name],
            officeRegisterCode: [this.selectedWorkStation.officeRegisterNumber],
            officeNationalCode: [this.selectedWorkStation.officeNationalCode, Validators.minLength(11)],
            officeRegisterDate: [this.selectedWorkStation.officeRegisterDateS],
            storeName: [this.selectedWorkStation.name],
            storeLicenseNumber: [this.selectedWorkStation.storeLicenseNumber],
            storeLicenseDate: [this.selectedWorkStation.storeLicenseDateS],
            aboutWorkStation: [this.selectedWorkStation.info]
        });
        this.buildFormDone = true;

    }

    onEditWorkTypeChange(event: any) {
        this.showStorePanel = false;
        this.showCompanyPanel = false;
        let officeNameCtrl: FormControl = (<any>this.bizForm).controls.officeName;
        let storeNameCtrl: FormControl = (<any>this.bizForm).controls.storeName;
        if (event.value.id == WorkTypeEnum.company) {
            this.showStorePanel = false;
            this.showCompanyPanel = true;
            storeNameCtrl.setValidators(null);
            officeNameCtrl.setValidators(Validators.required);
            this.cdRef.detectChanges();

            
        }
        else if (event.value.id == WorkTypeEnum.store) {
            this.showStorePanel = true;
            this.showCompanyPanel = false;
            this.cdRef.detectChanges();
            storeNameCtrl.setValidators(Validators.required);
            officeNameCtrl.setValidators(null);
        }
    }

    initData() {
        try {
            this.selectedWorkStation = new WorkStation();
            this.selectedWorkStation.id = this.inputWorkStation.id;
            this.selectedWorkStation.code = this.inputWorkStation.code;
            this.selectedWorkStation.title = this.inputWorkStation.title;
            this.selectedWorkStation.workType = this.inputWorkStation.workType;
            this.selectedWorkStation.name = this.inputWorkStation.name;
            this.selectedWorkStation.officeNationalCode = this.inputWorkStation.officeNationalCode;
            this.selectedWorkStation.officeRegisterDateS = this.inputWorkStation.officeRegisterDateS;
            this.selectedWorkStation.officeRegisterNumber = this.inputWorkStation.officeRegisterNumber;
            this.selectedWorkStation.storeLicenseDateS = this.inputWorkStation.storeLicenseDateS;
            this.selectedWorkStation.storeLicenseNumber = this.inputWorkStation.storeLicenseNumber;
            this.selectedWorkStation.info = this.inputWorkStation.info;
            if (this.inputWorkStation.workStationCatalogs != undefined)
                this.selectedWorkStation.workStationCatalogs = this.inputWorkStation.workStationCatalogs;
            else
                this.selectedWorkStation.workStationCatalogs = [];

            if (this.selectedWorkStation.workType != undefined) {
                if (this.selectedWorkStation.workType.id == WorkTypeEnum.company)
                    this.showCompanyPanel = true;
                if (this.selectedWorkStation.workType.id == WorkTypeEnum.store)
                    this.showStorePanel = true;
            }

            this.selectedWorkStationCatalogImgs = [];
            let _selectedWorkStationCatalogImgs = [...this.selectedWorkStationCatalogImgs];
            this.selectedWorkStation.workStationCatalogs.forEach(element => {
                let imgPath = this.baseImagePath + "/" + element.photo;
                _selectedWorkStationCatalogImgs.push({ source: imgPath, thumbnail: imgPath, title: element.info });
            });
            this.selectedWorkStationCatalogImgs = _selectedWorkStationCatalogImgs;
            this.uploadedFiles = [];
        }
        catch (e) {
            console.log(e);
        }
    }
    dateSetup(){
        if (this.editMode) {
            if (this.selectedWorkStation.workType != undefined) {
                let officeNameCtrl: FormControl = (<any>this.bizForm).controls.officeName;
                let storeNameCtrl: FormControl = (<any>this.bizForm).controls.storeName;
                if (this.selectedWorkStation.workType.id == WorkTypeEnum.company) {
                    storeNameCtrl.setValidators(null);
                    officeNameCtrl.setValidators(Validators.required);
                    this.cdRef.detectChanges();
                }
                if (this.selectedWorkStation.workType.id == WorkTypeEnum.store) {
                    storeNameCtrl.setValidators(Validators.required);
                    officeNameCtrl.setValidators(null);
                    this.cdRef.detectChanges();
                }
            }
        }
    }
    onSubmitBizform() {
        try {
            if (this.editMode) {
                if (this.selectedWorkStation.workType != undefined) {
                    if (this.selectedWorkStation.workType.id == WorkTypeEnum.company){
                        if(this._companyRegisterDate != undefined)
                            this.selectedWorkStation.officeRegisterDateS = moment(this._companyRegisterDate).locale('fa').format('YYYY/MM/DD HH:mm:ss');
                            // if(this.selectedWorkStation.officeRegisterDateS != '')
                            //     this.selectedWorkStation.officeRegisterDateS =
                            //      this.selectedWorkStation.officeRegisterDateS + this.shared.dateTime_Tail;
                    }
                    else if (this.selectedWorkStation.workType.id == WorkTypeEnum.store){
                        if(this._storeRegisterDate != undefined)
                         this.selectedWorkStation.storeLicenseDateS = moment(this._storeRegisterDate).locale('fa').format('YYYY/MM/DD HH:mm:ss');

                            // if(this.selectedWorkStation.storeLicenseDateS != '')
                            //     this.selectedWorkStation.storeLicenseDateS = 
                            //             this.selectedWorkStation.storeLicenseDateS + this.shared.dateTime_Tail;
                    }
                }
                this.selectedWorkStation.workStationCatalogs = this.WorkerStationCatalogList;
                
                this.loading = true;
                this._dService.editInfo(this.selectedWorkStation)
                    .subscribe(response => {
                        this.loading = false;
                        this.onSave.emit(<WorkStation>response);
                    },
                    error => {
                        let obj: WorkStation = error.error;
                        let err: BackendMessage = obj.error;
                        this.parseError(error.status, err);
                        this.loading = false;
                    });
            }
            else {
                this.onClose.emit(false);
            }

        }
        catch (e) {
            console.log(e);
        }

    }
    onUpload(event: any) {
        let responseMsg: BackendMessage = JSON.parse(event.xhr.responseText);
        this.uploadedImageName = responseMsg.msg[0].msg;
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }
        let catalog: WorkerStationCatalog = new WorkerStationCatalog();
        catalog.photo = this.uploadedImageName;
        this.WorkerStationCatalogList.push(catalog);
        this.onUploadT.emit(this.shared.uploadSuccessMsg);
    }
    selectCatalogImage(catalogImage: any) {
        this.selectedImageCatalog = catalogImage;
        this.onDisplayCatalogImageDialog.emit(this.selectedImageCatalog);
    }
    deleteCatalogImage(catalogImage: any) {
        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                this._dService.deleteCatalog(this.selectedWorkStation)
                    .subscribe(response => {
                        this.onSave.emit(<WorkStation>response);

                    },
                    error => {
                        let err: BackendMessage = error.error;
                        this.parseError(error.status, err);
                        this.loading = false;
                    });
            }
        });
    }
    parseError(status: any, err: any) {
        this.errorCntrler.gMessage = [];
        this.msgs = [];
        let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(status, err);
        let errorMessages = this.errorCntrler.gMessage;
        errorMessages.forEach(element => {
            this.msgs.push(element);
        });
    }
}