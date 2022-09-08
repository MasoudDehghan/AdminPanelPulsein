import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, SelectItem } from 'primeng/primeng';
import { GrowlMessage } from '../entities/growlMessage.class';
import { JobCategory1 } from '../entities/JobCategory1.class';
import { JobCategory2 } from '../entities/JobCategory2.class';
import { JobCategory3 } from '../entities/JobCategory3.class';
import { BackendMessage } from '../entities/Msg.class';
import { Worker } from '../entities/worker.class';
import { WorkerToJobsMap } from '../entities/workerToJobsMap.class';
import { WorkStation } from '../entities/workStation.class';
import { WorkStationJob } from '../entities/workStationJob.class';
import { JobCateogryService } from '../services/jobCategory.service';
import { SharedFunctions } from '../services/shared-functions.service';
import { SharedValues } from '../services/shared-values.service';
import { WorkerMgmService } from '../services/workerMgm.service';
import { Constant } from '../shared/constants.class';
import * as glob from '../shared/global';
import { HandleErrorMsg } from '../shared/handleError.class';



@Component({
    moduleId: module.id,
    selector: 'editWorkerComponent',
    templateUrl: './editWorker.template.html',
    styleUrls: ['../../assets/css/dashboard.css'],
    providers:[JobCateogryService,WorkerMgmService]
})

export class EditWorkerComponent implements OnInit {
    @Input() inputWorkStation: WorkStation;
    @Input() inputWorker: Worker;
    @Input() jobCategory1List: SelectItem[] = [];
    @Output() onClose = new EventEmitter<boolean>();
    @Output() onSave = new EventEmitter<WorkStation>();

    selectedWorkStation: WorkStation = new WorkStation();
    selectedWorker: Worker = new Worker();
    editJobCategory2List: SelectItem[] = [];
    editJobCategory3List: SelectItem[] = [];
    form: FormGroup;
    workStation: WorkStation = new WorkStation();
    loading: boolean = false;
    errorCntrler: HandleErrorMsg;

    selectedWorkerStationJobs: WorkStationJob;
    selectedJobCategory1ID: number = 0;


    selectedJobCategory1: JobCategory1 = null;
    selectedJobCategory2: JobCategory2 = null;
    selectedJobCategory3: JobCategory3 = null;

    _jobCategory1List: SelectItem[] = [];
    workerToJobMapList: WorkerToJobsMap[] = [];

    maximumFileSize = Constant.maximumFileSize;

    msgs: GrowlMessage[] = [];

    constructor(private _router: Router,
        private _fb: FormBuilder, 
        private _workerService: WorkerMgmService,
        private _jService: JobCateogryService,
        private confirmationService: ConfirmationService,
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
                firstName: new FormControl([this.inputWorker.user.firstName], Validators.required),
                lastName: new FormControl([this.inputWorker.user.lastName], Validators.required),
                mobileNumber: new FormControl([this.inputWorker.user.mobileNumber]),
                nationalCode: new FormControl([this.inputWorker.user.nationalCode]),
                sex: new FormControl([this.inputWorker.user.sex])
            })
        });
        this.showWorkerDataAction();

    }

    ngOnChange() {
        this.showWorkerDataAction();

    }
    showWorkerDataAction() {
        try {

            this.selectedWorkStation = new WorkStation();
            this.selectedWorkStation.id = this.inputWorkStation.id;
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
            this.selectedWorker = new Worker();
            this.selectedWorker.id = this.inputWorker.id;
            this.selectedWorker.user.firstName = this.inputWorker.user.firstName;
            this.selectedWorker.user.lastName = this.inputWorker.user.lastName;
            this.selectedWorker.user.mobileNumber = this.inputWorker.user.mobileNumber;
            this.selectedWorker.user.nationalCode = this.inputWorker.user.nationalCode;
            this.selectedWorker.user.sex = this.inputWorker.user.sex;
            this.selectedWorker.workerToJobsMaps = this.inputWorker.workerToJobsMaps;
            this.workerToJobMapList = this.inputWorker.workerToJobsMaps;;
        }
        catch (e) {
            console.log(e);
        }
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
            let worker: Worker = new Worker();
            worker.id = this.selectedWorker.id;
            worker.workerToJobsMaps = [];
            worker.workerToJobsMaps.push(wj);

            this._workerService.addJob(worker)
                .subscribe(response => {
                    //this.loading = false;
                    _workerToJobMapList.push(wj);
                    this.workerToJobMapList = _workerToJobMapList;
                },
                error => {
                    this.msgs = [];
                    this.errorCntrler.gMessage = [];
                    let obj: Worker = error.error;
                    let err: BackendMessage = obj.error;
                    let errMessage: BackendMessage = 
                        this.errorCntrler.handleErrorMethod(error.status, err);
                    let errorMessages = this.errorCntrler.gMessage;
                    errorMessages.forEach(element => {
                        this.msgs.push(element);
                    });
                });

        }
        catch (e) {
            console.log(e.status);
        }
    }

    removeWorkerJobMap(wj: WorkerToJobsMap) {
        let worker: Worker = new Worker();
        worker.id = this.selectedWorker.id;
        worker.workerToJobsMaps = [];
        worker.workerToJobsMaps.push(wj);
        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                // this.loading = true;                
                this._workerService.deleteJob(worker)
                    .subscribe(response => {
                        //this.loading = false;
                        let selectedWorkerJobMap = this.workerToJobMapList.find(x => x == wj);
                        let index = this.workerToJobMapList.indexOf(selectedWorkerJobMap, 0);
                        this.workerToJobMapList = this.workerToJobMapList.filter((val, i) => i != index);
                    },
                    error => {
                        this.msgs = [];
                        this.errorCntrler.gMessage = [];
                        let obj: Worker = error.error;
                        let err: BackendMessage = obj.error;
                        let errMessage: BackendMessage = 
                            this.errorCntrler.handleErrorMethod(error.status, err);
                        let errorMessages = this.errorCntrler.gMessage;
                        errorMessages.forEach(element => {
                            this.msgs.push(element);
                        });
                    });
            }
        });

    }



    onSubmit() {
        try {

            let personalDataFG = <FormGroup>this.form.controls.personalData;

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

            if (this.workerToJobMapList.length == 0) {
                this.msgs.push({ severity: 'error', summary: glob.errorLabel, detail: glob.InnerCode_EmptyJobsListMsg });
                throw new Error(glob.InnerCode_EmptyJobsListMsg);
            }
            this.selectedWorker.user.mobileNumber = mobileVal;

            this.loading = true;
            let worker: Worker = new Worker();
            worker.id = this.inputWorker.id;
            worker.user.firstName = this.selectedWorker.user.firstName;
            worker.user.lastName = this.selectedWorker.user.lastName;
            worker.user.mobileNumber = this.selectedWorker.user.mobileNumber;
            worker.user.sex = this.selectedWorker.user.sex;
            worker.user.nationalCode = this.selectedWorker.user.nationalCode;
            this._workerService.editInfo(worker).subscribe(response => {
                this.loading = false;
                this.onSave.emit(<WorkStation>response);
            },
                error => {
                    this.msgs = [];
                    this.errorCntrler.gMessage = [];
                    let obj: Worker = error.error;
                    let err: BackendMessage = obj.error;
                    let errMessage: BackendMessage = 
                        this.errorCntrler.handleErrorMethod(error.status, err);
                    let errorMessages = this.errorCntrler.gMessage;
                    errorMessages.forEach(element => {
                        this.msgs.push(element);
                    });
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
    cloneWorker(inputWorker:Worker):Worker{
        let out:Worker = new Worker();
        out.id = inputWorker.id;
        out.user.firstName = inputWorker.user.firstName;
        out.user.lastName = inputWorker.user.lastName;
        out.active = inputWorker.active;
        out.user.birthYear = inputWorker.user.birthYear;
        out.code = inputWorker.code;
        out.user.email = inputWorker.user.email;
        out.experienceStart = inputWorker.experienceStart;
        out.user.mobileNumber = inputWorker.user.mobileNumber;
        out.user.nationalCode = inputWorker.user.nationalCode;
        out.user.ownerFlag = inputWorker.user.ownerFlag;
        out.user.workerFlag = inputWorker.user.workerFlag;
        out.user.password = inputWorker.user.password;
        out.user.photo = inputWorker.user.photo;
        out.registerBy = inputWorker.registerBy;
        out.registerState = inputWorker.registerState;
        out.registerTimeS = inputWorker.registerTimeS;
        out.requests = inputWorker.requests;
        out.user.sex = inputWorker.user.sex;
        out.showCurrentLocation = inputWorker.showCurrentLocation;
        out.updateTimeS = inputWorker.updateTimeS;
        out.verifyBy = inputWorker.verifyBy;
        out.verifyTimeS = inputWorker.verifyTimeS;
        out.workerDocuments = inputWorker.workerDocuments;
        out.workerPhones = inputWorker.workerPhones;
        out.workerScore = inputWorker.workerScore;
        out.workerToJobsMaps = inputWorker.workerToJobsMaps;
        out.workerToServiceCityMaps = inputWorker.workerToServiceCityMaps;
        out.workStation = inputWorker.workStation;
        out.workTime = inputWorker.workTime;
        return out;
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