import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterStateEnum } from 'app/enums/registerState.enum';
import { SelectItem } from 'primeng/primeng';
import { GrowlMessage } from '../entities/growlMessage.class';
import { JobCategory1 } from '../entities/JobCategory1.class';
import { JobCategory2 } from '../entities/JobCategory2.class';
import { JobCategory3 } from '../entities/JobCategory3.class';
import { BackendMessage } from '../entities/Msg.class';
import { User } from '../entities/user.class';
import { Worker } from '../entities/worker.class';
import { WorkerToJobsMap } from '../entities/workerToJobsMap.class';
import { WorkStation } from '../entities/workStation.class';
import { WorkStationJob } from '../entities/workStationJob.class';
import { SharedFunctions } from '../services/shared-functions.service';
import { SharedValues } from '../services/shared-values.service';
import { WorkerMgmService } from '../services/workerMgm.service';
import { HandleErrorMsg } from '../shared/handleError.class';
import { RegisterState } from './../entities/registerState.class';
import { JobCateogryService } from './../services/jobCategory.service';
import { Constant } from './../shared/constants.class';


@Component({
    moduleId: module.id,
    selector: 'addWorkerComponent',
    templateUrl: './addWorker.template.html',
    styleUrls: ['../../assets/css/dashboard.css'],
    providers:[JobCateogryService,WorkerMgmService]
})

export class AddWorkerComponent implements OnInit {
    @Input() inputWorkStation: WorkStation;
    selectedWorkStation: WorkStation = new WorkStation();
    @Input() jobCategory1List: SelectItem[] = [];
    editJobCategory2List: SelectItem[] = [];
    editJobCategory3List: SelectItem[] = [];

    @Output() onClose = new EventEmitter<boolean>();
    @Output() onSave = new EventEmitter<WorkStation>();
    form: FormGroup;
    workStation: WorkStation = new WorkStation();
    loading: boolean = false;
    errorCntrler: HandleErrorMsg;

    selectedWorkerStationJobs: WorkStationJob;
    selectedJobCategory1ID: number = 0;

    newWorkerFirstName: string;
    newWorkerLastName: string;
    newWorkerSex: number;
    newWorkerNationalCode: string;
    newWorkerPhoto: string;
    newMobileNumber: string;
    isOwnerData: string;
    selectedJobCategory1: JobCategory1 = null;
    selectedJobCategory2: JobCategory2 = null;
    selectedJobCategory3: JobCategory3 = null;

    _jobCategory1List: SelectItem[] = [];
    workerToJobMapList: WorkerToJobsMap[] = [];

    maximumFileSize = Constant.maximumFileSize;

    msgs: GrowlMessage[] = [];

    constructor(private _router: Router,
        private _fb: FormBuilder, private cdRef: ChangeDetectorRef,
        private _workerService: WorkerMgmService,
        private _jService: JobCateogryService,
        private sharedFunctions: SharedFunctions,
        public shared: SharedValues
    ) {

    }
    ngOnInit() {
        this.errorCntrler = new HandleErrorMsg(this._router);
        this.form = this._fb.group({
            jobCategory1FormCntrl: [''],
            jobCategory2FormCntrl: [''],
            jobCategory3FormCntrl: [''],
            personalData: new FormGroup({
                firstName: new FormControl([''], Validators.required),
                lastName: new FormControl([''], Validators.required),
                nationalCode: new FormControl([''], Validators.pattern('^[0-9]{10}$')),
                sex: new FormControl(['']),
                isOwner: new FormControl(['']),
                mobileNumber: new FormControl([''])
            })
        });
        this.isOwnerData = "other";
        this.showJobDataAction();

    }

    ngOnChange() {
        this.showJobDataAction();
        this.cdRef.detectChanges();


    }


    onJobCategory1EditChange(event: any) {
        this.selectedJobCategory1 = event.value;
        this.selectedJobCategory2 = new JobCategory2();
        this.initJobCategory2List();
    }
    onJobCategory2EditChange(event: any) {
        this.selectedJobCategory2 = event.value;
        this.selectedJobCategory3 = new JobCategory3();
        this.initJobCategory3List();
    }
    initJobCategory2List() {
        this.editJobCategory2List = [];
        this.editJobCategory2List.push({ label: this.shared.chooseJC2Msg, value: 0 });
        if (this.selectedJobCategory1 != null) {
            if (this.selectedJobCategory1.id != undefined) {
                if (this.selectedJobCategory1.id != 0) {
                    this._jService.geJobCategory2List(this.selectedJobCategory1.id)
                        .subscribe(response => {
                            let list: JobCategory2[] = <JobCategory2[]>response;
                            list.forEach(element => {
                                this.editJobCategory2List.push({ label: element.name, value: element });
                            });
                            this.selectedJobCategory2 = list[0];
                            this.initJobCategory3List();
                        }
                        , error => {
                            let obj: JobCategory2[] = error.error;
                            let err: BackendMessage = obj[0].error;
                            this.parseError(error.status, err);
                        }
                        );
                }
            }
        }
    }
    initJobCategory3List() {
        this.editJobCategory3List = [];

        if (this.selectedJobCategory2.id != undefined) {
            if (this.selectedJobCategory2.id != 0) {

                this._jService.geJobCategory3List(this.selectedJobCategory2.id)
                    .subscribe(response => {
                        let list: JobCategory3[] = <JobCategory3[]>response;
                        list.forEach(element => {
                            this.editJobCategory3List.push({ label: element.name, value: element });
                        });
                        this.selectedJobCategory3 = list[0];
                    }
                    , error => {
                        let obj: JobCategory3[] = error.error;
                        let err: BackendMessage = obj[0].error;
                        this.parseError(error.status, err);
                    }
                    );
            }
        }
    }
    addWorkerJobMap() {
        try {
            let _workerToJobMapList = [...this.workerToJobMapList];
            let wj: WorkerToJobsMap = new WorkerToJobsMap();
            wj.jobCategory3 = this.selectedJobCategory3;
            if (this.selectedJobCategory1 == null) {
                this.msgs.push({ severity: 'warn', summary: this.shared.warningLabel, detail: this.shared.chooseJC1Msg });
                return;
            }
            if (this.searchWorkerJobMapInList(wj)) {
                this.msgs.push({ severity: 'warn', summary: this.shared.warningLabel, detail: this.shared.repeatedWorkerJobMsg });
                return;
            }

            _workerToJobMapList.push(wj);
            this.workerToJobMapList = _workerToJobMapList;
        }
        catch (e) {
            console.log(e.status);
        }
    }
    removeWorkerJobMap(wj: WorkerToJobsMap) {
        let selectedWorkerJobMap = this.workerToJobMapList.find(x => x == wj);
        let index = this.workerToJobMapList.indexOf(selectedWorkerJobMap, 0);
        this.workerToJobMapList = this.workerToJobMapList.filter((val, i) => i != index);
    }
    searchWorkerJobMapInList(wj: WorkerToJobsMap): boolean {
        let out = false;
        try {
            this.workerToJobMapList.forEach(element => {
                        if (Number(element.jobCategory3.id) == Number(wj.jobCategory3.id))
                            out = true;
                
            });
            return out;
        }
        catch (e) {
            return false;
        }
    }
    showJobDataAction() {
        try {

            this.selectedWorkStation = new WorkStation();
            this.selectedWorkStation.id = this.inputWorkStation.id;
            this.selectedWorkStation.owner = this.inputWorkStation.owner;
            this._jobCategory1List = [];
            this.jobCategory1List.forEach(element => {
                if (element.value != null) {
                    if (element.value != 0) {
                        this._jobCategory1List.push(element);
                    }
                }

            });
            this.selectedJobCategory1 = this.jobCategory1List[0].value;
            this.initJobCategory2List();
        }
        catch (e) {
            console.log(e);
        }
    }

    onSubmit() {
        try {

            let personalDataFG = <FormGroup>this.form.controls.personalData;
            if (this.isOwnerData == 'other') {
                let firstNameVal = personalDataFG.controls['firstName'].value;
                let firstNameValid = personalDataFG.controls['firstName'].valid;
                if (!firstNameValid || firstNameVal == "" || firstNameVal == undefined) {
                    this.msgs.push({ severity: 'warn', summary: '', detail: this.shared.InnerCode_InvalidFirstNameMsg });
                    throw new Error(this.shared.InnerCode_InvalidFirstNameMsg);
                }

                let lastNameVal = personalDataFG.controls['lastName'].value;
                let lastNameValid = personalDataFG.controls['lastName'].valid;
                if (!lastNameValid || lastNameVal == "" || lastNameVal == undefined) {
                    this.msgs.push({ severity: 'warn', summary: '', detail: this.shared.InnerCode_InvalidLastNameMsg });
                    throw new Error(this.shared.InnerCode_InvalidLastNameMsg);
                }

                let mobileVal = personalDataFG.controls['mobileNumber'].value;
                let mobileValid = personalDataFG.controls['mobileNumber'].valid;
                if (!mobileValid || mobileVal == "" || mobileVal == undefined) {
                    this.msgs.push({ severity: 'warn', summary: '', detail: this.shared.invalidMobileMsg });
                    throw new Error(this.shared.invalidMobileMsg);
                }
                mobileVal = this.sharedFunctions.convertPersianNumberToEnglish(mobileVal);
                if (!mobileVal.match(Constant.mobileNumberRgx)) {
                    this.msgs.push({ severity: 'warn', summary: '', detail: this.shared.invalidMobileMsg });
                    throw new Error(this.shared.invalidMobileMsg);
                }
                this.newMobileNumber = mobileVal;
            }
            if (this.workerToJobMapList.length == 0) {
                this.msgs.push({ severity: 'error', summary: this.shared.errorLabel, detail: this.shared.InnerCode_EmptyJobsListMsg });
                throw new Error(this.shared.InnerCode_EmptyJobsListMsg);
            }


            this.loading = true;
            let worker: Worker = new Worker();
            worker.workStation = new WorkStation();
            worker.workStation.id = this.selectedWorkStation.id;
            if (this.isOwnerData == 'other') {
                worker.user.firstName = this.newWorkerFirstName;
                worker.user.lastName = this.newWorkerLastName;
                worker.user.mobileNumber = this.newMobileNumber;
                worker.registerState = new RegisterState();
                worker.registerState.id = RegisterStateEnum.RegState_FirstReg;
            }
            else {
                worker.user = new User();
                worker.user.id = this.inputWorkStation.owner.id;
                worker.user.firstName = this.inputWorkStation.owner.firstName;
                worker.user.lastName = this.inputWorkStation.owner.lastName;
                worker.user.mobileNumber = this.inputWorkStation.owner.mobileNumber;
                worker.registerState = new RegisterState();
                worker.registerState.id = RegisterStateEnum.RegState_FirstReg;

            }

            worker.workerToJobsMaps = this.workerToJobMapList;
            this._workerService.addWorker(worker).subscribe(response => {
                this.loading = false;
                this.onSave.emit(<WorkStation>response);
            },
                error => {
                    let obj: Worker = error.error;
                    let err: BackendMessage = obj.error;
                    this.parseError(error.status, err);
                    this.loading = false;
                });
        }
        catch (e) {
            console.log(e);
        }
    }
    closePanel() {
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