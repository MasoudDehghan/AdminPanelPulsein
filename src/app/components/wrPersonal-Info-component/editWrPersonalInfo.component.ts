import { Component, Input, Output, OnInit, OnChanges, EventEmitter, ChangeDetectorRef } from '@angular/core'
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'

import { WorkStation } from '../../entities/workStation.class'
import { HandleErrorMsg } from '../../shared/handleError.class'
import { BackendMessage } from '../../entities/Msg.class'
import { User } from '../../entities/user.class'
import { SelectItem } from 'primeng/primeng';
import { Router } from '@angular/router';
import { Worker } from '../../entities/worker.class'
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { GrowlMessage } from '../../entities/growlMessage.class'
import { SharedValues } from '../../services/shared-values.service'
import { WorkerMgmService } from '../../services/workerMgm.service'
import { SharedFunctions } from '../../services/shared-functions.service'


@Component({
    moduleId: module.id,
    selector: 'editWorkerPersonalComponent',
    templateUrl: './editWrPersonalInfo.template.html',
    styleUrls: ['../../../assets/css/dashboard.css']
})

export class EditWorkerPersonalInfoComponent implements OnInit {
    @Input() inputWorkerID: number;
    @Input() editMode: boolean;
    @Output() onClose = new EventEmitter<boolean>();
    @Output() onSave = new EventEmitter<Worker>();

    inputWorker:Worker;
    selectedWorkStation: WorkStation = new WorkStation();
    selectedWorker: Worker = new Worker();

    form: FormGroup;
    workStation: WorkStation = new WorkStation();
    loading: boolean = false;
    errorCntrler: HandleErrorMsg;
    yearList: SelectItem[];

    msgs: GrowlMessage[] = [];

    constructor(private _router: Router,
        private _fb: FormBuilder, private cdRef: ChangeDetectorRef,
        private _workerService: WorkerMgmService,
        private confirmationService: ConfirmationService,
        private sharedFunctions: SharedFunctions,
        public shared: SharedValues
    ) {

    }
    ngOnInit() {
        this.errorCntrler = new HandleErrorMsg(this._router);
        this.yearList = this.sharedFunctions.initYearList();

        this.loading = true;
        this._workerService.lookupById(this.inputWorkerID)
            .subscribe(response => {
                this.inputWorker = <Worker>response;
                this.form = this._fb.group({
                    firstName: [this.inputWorker.user.firstName, Validators.required],
                    lastName: [this.inputWorker.user.lastName, Validators.required],
                    mobileNumber: [this.inputWorker.user.mobileNumber],
                    nationalCode: [this.inputWorker.user.nationalCode],
                    sex: [this.inputWorker.user.sex],
                    birthYear: [this.inputWorker.user.birthYear],
                    experienceStart: [this.inputWorker.experienceStart]
        
                });
                this.cloneToSelectedWorker(this.inputWorker);
                this.loading = false;
            }
                , error => {
                    let obj: Worker = error.error;
                    let err: BackendMessage = obj.error;
                    this.parseError(error.status, err);
                }
            );

        


    }



    cloneToSelectedWorker(worker: Worker) {
        try {
            this.selectedWorker = new Worker();
            this.selectedWorker.id = worker.id;
            this.selectedWorker.user = new User();
            this.selectedWorker.user.id = worker.user.id;
            this.selectedWorker.user.firstName = worker.user.firstName;
            this.selectedWorker.user.lastName = worker.user.lastName;
            this.selectedWorker.user.nationalCode = worker.user.nationalCode;
            this.selectedWorker.user.sex = worker.user.sex;
            this.selectedWorker.user.photo = worker.user.photo;
            this.selectedWorker.experienceStart = worker.experienceStart;




        }
        catch (e) {
            console.log(e);
        }
    }

    onSubmit() {
        try {
            if (this.editMode) {
                this.loading = true;

                this._workerService.editInfo(this.selectedWorker).subscribe(response => {
                    this.loading = false;
                    this.onSave.emit(<Worker>response);

                }, error => {
                    this.loading = false;
                    this.errorCntrler.gMessage = [];
                    let err: BackendMessage = this.errorCntrler.handleError(error);
                    let errorMessages = this.errorCntrler.gMessage;
                    this.msgs = [];
                    errorMessages.forEach(element => {
                        this.msgs.push(element);
                    });

                });

            }
            else
                this.onClose.emit(false);

        }
        catch (e) {
            console.log(e);
        }
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