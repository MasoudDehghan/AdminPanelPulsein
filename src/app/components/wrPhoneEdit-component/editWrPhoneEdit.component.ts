import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { BackendMessage } from '../../entities/Msg.class'
import { Worker } from '../../entities/worker.class'
import { WorkerPhone } from '../../entities/workerPhone.class'
import { SharedFunctions } from '../../services/shared-functions.service'
import { SharedValues } from '../../services/shared-values.service'
import { WorkerMgmService } from '../../services/workerMgm.service'
import { Constant } from '../../shared/constants.class'
import { HandleErrorMsg } from '../../shared/handleError.class'


@Component({
    moduleId: module.id,
    selector: 'editWorkerPhoneInfoComponent',
    templateUrl: './editWrPhoneEdit.template.html',
    styleUrls: ['../../../assets/css/dashboard.css'],
    providers:[WorkerMgmService]
})

export class EditWorkerPhoneComponent implements OnInit {
    workerPhoneForm: FormGroup;
    @Input() inputWorkerID: number;
    @Input() workerPhone: WorkerPhone;
    selectedWorker: Worker = new Worker();
    @Input() editMode: boolean = false;
    @Input() newWorkerPhone: boolean = false;

    @Output() onClose = new EventEmitter<boolean>();
    @Output() onSave = new EventEmitter<Worker>();
    @Output() onError = new EventEmitter<string>();
    inputWorker: Worker;
    worker: Worker = new Worker();
    mobileNumber: number;
    workerPhoneList: WorkerPhone[] = [];
    loading: boolean = false;
    errorCntrler: HandleErrorMsg;
    displayPhoneDialog: boolean;
    selectedWorkerPhone: WorkerPhone;
    newPhone: WorkerPhone = new WorkerPhone();


    constructor(private _router: Router, private _fb: FormBuilder,
        public shared: SharedValues,
        private sharedFunctions: SharedFunctions,
        private _workerService: WorkerMgmService) {

    }
    ngOnInit() {
        this.init();
    }
    init() {
        this.errorCntrler = new HandleErrorMsg(this._router);

        this.workerPhoneForm = this._fb.group({
            phoneNumber: ['']
        });
        this.loading = true;
        this._workerService.lookupById(this.inputWorkerID)
            .subscribe(response => {
                this.loading = false;

                this.inputWorker = <Worker>response;

            }
                , error => {
                    this.loading = false;
                    let obj: Worker = error.error;
                    let err: BackendMessage = obj.error;
                    this.parseError(error.status, err);
                }
            );
    }

    CloneWorkerPhone(wp: WorkerPhone) {
        let workerPhone = new WorkerPhone();
        for (let prop in wp) {
            workerPhone[prop] = wp[prop];
        }

        return workerPhone;
    }

    onSubmitWPhoneform() {
        try {

            let val = this.workerPhoneForm.controls['phoneNumber'].value;
            let valid = this.workerPhoneForm.controls['phoneNumber'].valid;
            if (!valid || val == "" || val == undefined) {
                this.onError.emit(this.shared.invalidNumberMsg);
                throw new Error(this.shared.invalidNumberMsg);
            }
            val = this.sharedFunctions.convertPersianNumberToEnglish(val);

            if (!val.match(Constant.mobileNumberRgx)) {
                this.onError.emit(this.shared.invalidMobileMsg);
                throw new Error(this.shared.invalidMobileMsg);
            }

            if (this.searchNumberInList(val)) {
                this.onError.emit(this.shared.repeatedPhoneNumberMsg);
                throw new Error(this.shared.repeatedPhoneNumberMsg);
            }
            this.workerPhone.number = val;
            if (this.newWorkerPhone) {
                this.inputWorker.workerPhones[0] = this.workerPhone;
                this.loading = true;
                this._workerService.addPhone(this.inputWorker)
                    .subscribe(response => {
                        this.loading = false;
                        this.onSave.emit(<Worker>response);
                    },
                    error => {
                        let obj: Worker = error.error;
                        let err: BackendMessage = obj.error;
                        this.parseError(error.status, err);
                        this.loading = false;

                    });
            }
            else {
                this.inputWorker.workerPhones = [];
                this.inputWorker.workerPhones[0] = this.CloneWorkerPhone(this.workerPhone);
                this.loading = true;
                this._workerService.editPhone(this.inputWorker)
                    .subscribe(response => {
                        this.loading = false;
                        this.onSave.emit(<Worker>response);

                    },
                    error => {
                        let obj: Worker = error.error;
                        let err: BackendMessage = obj.error;
                        this.parseError(error.status, err);
                        this.loading = false;
                    });
            }
            this.workerPhone = null;
            this.displayPhoneDialog = false;
        }

        catch (e) {
            console.log(e);
        }
    }
    searchNumberInList(num: number): boolean {
        let out = false;
        try {
            this.workerPhoneList.forEach(element => {
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
    parseError(status: any, err: any) {
        this.errorCntrler.gMessage = [];
        let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(status, err);
        let errorMessages = this.errorCntrler.gMessage;
        errorMessages.forEach(element => {
            this.onError.emit(element.detail);
        }
        );
    }
}