import { Component, Input, Output, OnInit, OnChanges, EventEmitter, ChangeDetectorRef } from '@angular/core'
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Worker } from '../../entities/worker.class'
import { WorkerPhone } from '../../entities/workerPhone.class'
import { WorkerMgmService } from '../../services/workerMgm.service'
import { SharedFunctions } from '../../services/shared-functions.service'
import { HandleErrorMsg } from '../../shared/handleError.class'
import { BackendMessage } from '../../entities/Msg.class'
import { SelectItem } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { SharedValues } from '../../services/shared-values.service'
import { GrowlMessage } from '../../entities/growlMessage.class'
import { Router } from '@angular/router';
import { Constant } from '../../shared/constants.class';


@Component({
    moduleId: module.id,
    selector: 'editWorkerContactInfoComponent',
    templateUrl: './editWrContactInfo.template.html',
    styleUrls: ['../../../assets/css/dashboard.css'],
    providers:[WorkerMgmService]
})

export class EditWorkerContactComponent implements OnInit {
    contactEditForm: FormGroup;
    @Input() inputWorkerID: number;
    @Input() filterPhoneTypeList: SelectItem[] = [];
    selectedWorker: Worker = new Worker();
    @Input() editMode: boolean = false;
    @Output() onClose = new EventEmitter<boolean>();
    @Output() onSave = new EventEmitter<Worker>();
    @Output() onDelete = new EventEmitter<Worker>();
    @Output() onError = new EventEmitter<string>();
    @Output() onShowWorkerPhoneToAdd = new EventEmitter<Worker>();
    @Output() onShowWorkerPhoneToEdit = new EventEmitter<Worker>();
    inputWorker: Worker;
    worker: Worker = new Worker();
    panelWorker: Worker = new Worker();

    workerPhoneList: WorkerPhone[] = [];
    loading: boolean = false;
    errorCntrler: HandleErrorMsg;
    msgs: GrowlMessage[] = [];

    workerPhone: WorkerPhone = new WorkerPhone();


    constructor(private _router: Router, private _fb: FormBuilder, 
        private confirmationService: ConfirmationService, public shared: SharedValues,
        private sharedFunctions: SharedFunctions,
        private _workerService: WorkerMgmService) {

    }
    ngOnInit() {
        this.errorCntrler = new HandleErrorMsg(this._router);
        this.loading = true;
        this._workerService.lookupById(this.inputWorkerID)
            .subscribe(response => {
                this.loading = false;

                this.inputWorker = <Worker>response;

                this.contactEditForm = this._fb.group({
                    mobile: [this.selectedWorker.user.mobileNumber],
                    email: [this.selectedWorker.user.email, Validators.pattern(Constant.emailRegx)]
                });
                this.showContactDataAction();
            }
                , error => {
                    this.loading = false;
                    let obj: Worker = error.error;
                    let err: BackendMessage = obj.error;
                    this.parseError(error.status, err);
                }
            );

    }

    showPhoneDialogToAdd() {
        this.onShowWorkerPhoneToAdd.emit(this.selectedWorker);

    }


    onWorkerPhoneListRowSelect(event) {
        if (this.editMode) {
            this.workerPhone = this.CloneWorkerPhone(event.data);

            let oWorker = new Worker();
            oWorker.id = this.inputWorker.id;
            oWorker.workerPhones = [];
            oWorker.workerPhones[0] = this.CloneWorkerPhone(this.workerPhone);
            this.onShowWorkerPhoneToEdit.emit(oWorker);
        }
    }
    removeWorkerPhone2(ws: Worker, wp: WorkerPhone) {
        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                this.loading = true;
                this.selectedWorker.workerPhones = [];
                let _workerPhones = [...this.selectedWorker.workerPhones];
                _workerPhones[0] = wp;
                this.selectedWorker.workerPhones = _workerPhones;
                this._workerService.deletePhone(this.selectedWorker)
                    .subscribe(response => {
                        this.loading = false;
                        this.onSave.emit(<Worker>response);
                        let worker:Worker = <Worker>response;
                        _workerPhones = worker.workerPhones;
                        this.selectedWorker.workerPhones = _workerPhones;
                    },
                    error => {
                        let err: BackendMessage = error.error;
                        this.parseError(error.status, err);
                        this.loading = false;
                    });
            }
        });
    }

    CloneWorkerPhone(wp: WorkerPhone) {
        let workerPhone = new WorkerPhone();
        for (let prop in wp) {
            workerPhone[prop] = wp[prop];
        }

        return workerPhone;
    }
    showContactDataAction() {
        this.selectedWorker = new Worker();
        this.selectedWorker.id = this.inputWorker.id;
        this.selectedWorker.workerPhones = [];
        let _workerPhones = [...this.selectedWorker.workerPhones];

        let iii = 0;
        this.inputWorker.workerPhones.forEach(element => {
            _workerPhones[iii] = element;
            iii++;
        });
        this.selectedWorker.workerPhones = _workerPhones;

        this.selectedWorker.user.mobileNumber = this.inputWorker.user.mobileNumber;
        this.selectedWorker.user.email = this.inputWorker.user.email;
    }

    onSubmitContactform() {
        if (this.editMode) {
            let val = this.contactEditForm.controls['mobile'].value;
            let valid = this.contactEditForm.controls['mobile'].valid;
            if (!valid || val == "" || val == undefined) {
                this.msgs.push({ severity: 'warn', summary: '', detail: this.shared.invalidPhoneMsg });
                throw new Error(this.shared.invalidPhoneMsg);
            }
            val = this.sharedFunctions.convertPersianNumberToEnglish(val);
            if (!val.match(Constant.mobileNumberRgx)) {
                this.msgs.push({ severity: 'warn', summary: '', detail: this.shared.invalidPhoneMsg });
                throw new Error(this.shared.invalidPhoneMsg);
            }
            this.selectedWorker.user.mobileNumber = val;
            this.loading = true;
            this._workerService.editContact(this.selectedWorker)
                .subscribe(response => {
                    this.onSave.emit(<Worker>response);
                    this.loading = false;
                },
                error => {
                    let obj: Worker = error.error;
                    let err: BackendMessage = obj.error;
                    this.parseError(error.status, err);
                    this.loading = false;
                });
        }
        else
            this.onClose.emit(false);
    }
    close() {
        this.onClose.emit(false);
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