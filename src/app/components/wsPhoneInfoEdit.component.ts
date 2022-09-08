import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { ConfirmationService, SelectItem } from 'primeng/primeng'
import { BackendMessage } from '../entities/Msg.class'
import { PhoneType } from '../entities/phoneType.class'
import { WorkStation } from '../entities/workStation.class'
import { WorkStationPhone } from '../entities/workStationPhone.class'
import { PhoneTypeEnum } from '../enums/phoneType.enum'
import { SharedFunctions } from '../services/shared-functions.service'
import { SharedValues } from '../services/shared-values.service'
import { WorkerStationMgmService } from '../services/workerStationMgm.service'
import { Constant } from '../shared/constants.class'
import { HandleErrorMsg } from '../shared/handleError.class'


@Component({
    moduleId: module.id,
    selector: 'wsPhoneInfoComponent',
    templateUrl: './wsPhoneInfoEdit.template.html',
    styleUrls: ['../../assets/css/dashboard.css'],
    providers:[WorkerStationMgmService]
})

export class WorkStationPhoneInfoEdit implements OnInit {
    workStationPhoneForm: FormGroup;
    @Input() inputWorkStation: WorkStation;
    @Input() workStationPhone: WorkStationPhone;
    @Input() filterPhoneTypeList: SelectItem[] = [];
    selectedWorkStation: WorkStation = new WorkStation();
    @Input() editMode: boolean = false;
    @Input() newWorkStationPhone: boolean = false;

    @Output() onClose = new EventEmitter<boolean>();
    @Output() onSave = new EventEmitter<WorkStation>();
    @Output() onError = new EventEmitter<string>();
    workStation: WorkStation = new WorkStation();
    phoneTypeID: number;
    landLineTelNumber: number;
    mobileNumber: number;
    faxNumber: number;
    workStationPhoneList: WorkStationPhone[] = [];
    loading: boolean = false;
    errorCntrler: HandleErrorMsg;
    saveLabel = this.shared.saveLabelFa;
    closeLabel = this.shared.closeLabel;
    successFullChangeMsg = this.shared.successFullChangeMsg;
    workStationLabelFa = this.shared.workStationLabelFa;
    numberLabel = this.shared.numberLabel;
    typeLabel = this.shared.typeLabel;
    emptyPhoneListMsg = this.shared.emptyPhoneListMsg;
    registeredPhoneNumberList = this.shared.registeredPhoneNumberList;
    delLabelFa = this.shared.delLabelFa;
    addLabel = this.shared.addLabel;
    selectToEdit = this.shared.selectToEdit;
    invalidPhoneMsg = this.shared.invalidPhoneMsg;
    repeatedPhoneNumberMsg = this.shared.repeatedPhoneNumberMsg;
    invalidMobileMsg = this.shared.invalidMobileMsg;
    invalidFaxMsg = this.shared.invalidFaxMsg;
    invalidNumberMsg = this.shared.invalidNumberMsg;
    phoneEditMsg = this.shared.phoneEditMsg;
    displayPhoneDialog: boolean;
    selectedWorkStationPhone: WorkStationPhone;
    newPhone: WorkStationPhone = new WorkStationPhone();


    constructor(private _router: Router, private _fb: FormBuilder,
        private confirmationService: ConfirmationService,
        private sharedFunctions: SharedFunctions,
        public shared: SharedValues,
        private _dService: WorkerStationMgmService) {

    }
    ngOnInit() {
        this.init();
    }
    init() {
        this.errorCntrler = new HandleErrorMsg(this._router);

        this.workStationPhoneForm = this._fb.group({
            phoneNumber: [''],
            phoneTypeCntrl: ['']
        });
    }

    CloneWorkStationPhone(wp: WorkStationPhone) {
        let workStationPhone = new WorkStationPhone();
        for (let prop in wp) {
            workStationPhone[prop] = wp[prop];
            workStationPhone.phoneType = new PhoneType();
            workStationPhone.phoneType.id = wp.phoneType.id;
            if (workStationPhone.phoneType.id == PhoneTypeEnum.landline)
                workStationPhone.phoneType.name = this.shared.phoneLabel2;
            if (workStationPhone.phoneType.id == PhoneTypeEnum.mobile)
                workStationPhone.phoneType.name = this.shared.mobileLabel2;
            if (workStationPhone.phoneType.id == PhoneTypeEnum.fax)
                workStationPhone.phoneType.name = this.shared.faxLabel2;
        }

        return workStationPhone;
    }

    onSubmitWPhoneform() {
        try {

            let val = this.workStationPhoneForm.controls['phoneNumber'].value;
            let pType = this.workStationPhoneForm.controls['phoneTypeCntrl'].value;
            let valid = this.workStationPhoneForm.controls['phoneNumber'].valid;
            if (!valid || val == "" || val == undefined) {
                this.onError.emit(this.invalidNumberMsg);
                throw new Error(this.invalidNumberMsg);
            }
            val = this.sharedFunctions.convertPersianNumberToEnglish(val);
            if (pType == PhoneTypeEnum.landline) {
                if (!val.match(Constant.phoneNumberRgx)) {
                    this.onError.emit(this.invalidPhoneMsg);
                    throw new Error(this.invalidPhoneMsg);
                }
            }
            else if (pType == PhoneTypeEnum.mobile) {
                if (!val.match(Constant.mobileNumberRgx)) {
                    this.onError.emit(this.invalidMobileMsg);
                    throw new Error(this.invalidMobileMsg);
                }
            }
            else if (pType == PhoneTypeEnum.fax) {
                if (!val.match(Constant.phoneNumberRgx)) {
                    this.onError.emit(this.invalidFaxMsg);
                    throw new Error(this.invalidFaxMsg);
                }
            }
            if (this.searchNumberInList(val)) {
                this.onError.emit(this.repeatedPhoneNumberMsg);
                throw new Error(this.repeatedPhoneNumberMsg);
            }
            this.workStationPhone.number = val;
            
            if (this.newWorkStationPhone) {
                this.inputWorkStation.workStationPhones[0] = this.workStationPhone;
                this.loading = true;
                this._dService.addPhone(this.inputWorkStation)
                    .subscribe(response => {
                        this.loading = false;
                        this.onSave.emit(<WorkStation>response);
                    },
                    error => {
                        this.loading = false;
                        let obj: WorkStation = error.error;
                        let err: BackendMessage = obj.error;
                        this.errorCntrler.gMessage = [];
                        let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(status, err);
                        let errorMessages = this.errorCntrler.gMessage;
                        if (this.errorCntrler.repeatedEntityFound.length > 0) {
                            let eList: string = "";
                            let l = this.errorCntrler.repeatedEntityFound.length;
                            if (l > 1) {
                                this.errorCntrler.repeatedEntityFound.forEach(entity => {
                                    eList = entity + " , ";
                                });
                            }
                            else {
                                eList = this.errorCntrler.repeatedEntityFound[0];
                            }
                            let cMsg = this.shared.phoneRegisteredBeforeMsg + ":" + eList + "/" + this.shared.confirmText;
                            this.confirmationService.confirm({
                                message: cMsg,
                                accept: () => {
                                    this.loading = true;

                                    this._dService.addPhoneForce(this.inputWorkStation)
                                        .subscribe(response => {
                                            this.loading = false;
                                            this.onSave.emit(<WorkStation>response);
                                        },
                                        error => {
                                            errorMessages.forEach(element => {
                                                this.onError.emit(element.detail);
                                            });
                                        });
                                }
                            });
                        }
                        else {
                            errorMessages.forEach(element => {
                                this.onError.emit(element.detail);
                            });
                        }
                    });
            }
            else {
                this.inputWorkStation.workStationPhones = [];
                this.inputWorkStation.workStationPhones[0] = this.CloneWorkStationPhone(this.workStationPhone);
                this.loading = true;
                this._dService.editPhone(this.inputWorkStation)
                    .subscribe(response => {
                        this.loading = false;
                        this.onSave.emit(<WorkStation>response);

                    },
                    error => {
                        this.loading = false;
                        let obj: WorkStation = error.error;
                        let err: BackendMessage = obj.error;
                        this.errorCntrler.gMessage = [];
                        let errorMessages = this.errorCntrler.gMessage;

                        if (this.errorCntrler.repeatedEntityFound.length > 0) {
                            let eList: string = "";
                            let l = this.errorCntrler.repeatedEntityFound.length;
                            if (l > 1) {
                                this.errorCntrler.repeatedEntityFound.forEach(entity => {
                                    eList = entity + " , ";
                                });
                            }
                            else {
                                eList = this.errorCntrler.repeatedEntityFound[0];
                            }
                            let cMsg = this.shared.phoneRegisteredBeforeMsg + ":" + eList + "/" + this.shared.confirmText;
                            this.confirmationService.confirm({
                                message: cMsg,
                                accept: () => {
                                    this.loading = true;

                                    this._dService.editPhoneForce(this.inputWorkStation)
                                        .subscribe(response => {
                                            this.loading = false;
                                            this.onSave.emit(<WorkStation>response);
                                        },
                                        error => {
                                            errorMessages.forEach(element => {
                                                this.onError.emit(element.detail);
                                            });
                                        });
                                }
                            });
                        }
                        else {
                            errorMessages.forEach(element => {
                                this.onError.emit(element.detail);
                            });
                        }
                    });
            }
            this.workStationPhone = null;
            this.displayPhoneDialog = false;
        }

        catch (e) {
            console.log(e);
        }
    }
    searchNumberInList(num: number): boolean {
        let out = false;
        try {
            this.workStationPhoneList.forEach(element => {
                if (Number(element.number) == Number(num)) {
                    out = true;
                }
            });
            return out;
        }
        catch (e) {
            return false;
        }
    }

}