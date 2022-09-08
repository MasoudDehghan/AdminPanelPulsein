import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, SelectItem } from 'primeng/primeng';
import { GrowlMessage } from '../../entities/growlMessage.class';
import { JobCategory1 } from '../../entities/JobCategory1.class';
import { JobCategory2 } from '../../entities/JobCategory2.class';
import { JobCategory3 } from '../../entities/JobCategory3.class';
import { BackendMessage } from '../../entities/Msg.class';
import { Worker } from '../../entities/worker.class';
import { WorkerToJobsMap } from '../../entities/workerToJobsMap.class';
import { WorkStation } from '../../entities/workStation.class';
import { WorkStationJob } from '../../entities/workStationJob.class';
import { SharedValues } from '../../services/shared-values.service';
import { WorkerMgmService } from '../../services/workerMgm.service';
import { WorkerStationMgmService } from '../../services/workerStationMgm.service';
import { HandleErrorMsg } from '../../shared/handleError.class';
import { JobCateogryService } from './../../services/jobCategory.service';



@Component({
    moduleId: module.id,
    selector: 'editWorkerJobCatComponent',
    templateUrl: './editWrJobCat.template.html',
    styleUrls: ['../../../assets/css/dashboard.css'],
    providers: [WorkerStationMgmService,WorkerMgmService,JobCateogryService]

})

export class EditWorkerJobCatComponent implements OnInit {
    @Input() inputWorkerID: number;
    loading: boolean = false;
    jobCategory1List: SelectItem[] = [];
    @Output() onClose = new EventEmitter<boolean>();
    @Output() onSave = new EventEmitter<Worker>();

    inputWorker: Worker;
    selectedWorkStation: WorkStation = new WorkStation();
    selectedWorker: Worker = new Worker();
    editJobCategory2List: SelectItem[] = [];
    editJobCategory3List: SelectItem[] = [];
    form: FormGroup;
    workStation: WorkStation = new WorkStation();
  
    errorCntrler: HandleErrorMsg;

    selectedWorkerStationJobs: WorkStationJob;
    selectedJobCategory1ID: number = 0;


    selectedJobCategory1: JobCategory1 = null;
    selectedJobCategory2: JobCategory2 = null;
    selectedJobCategory3: JobCategory3 = null;

    _jobCategory1List: SelectItem[] = [];
    workerToJobMapList: WorkerToJobsMap[] = [];

    msgs: GrowlMessage[] = [];

    constructor(private _router: Router,
        private _fb: FormBuilder, private cdRef: ChangeDetectorRef,
        private _WorkerStationMgmService: WorkerStationMgmService,
        private _workerService: WorkerMgmService,
        private _jService: JobCateogryService,
        private confirmationService: ConfirmationService,
        public shared: SharedValues
    ) {

    }
    ngOnInit() {
        this.errorCntrler = new HandleErrorMsg(this._router);
        this.form = this._fb.group({
            jobCategory1FormCntrl: [''],
            jobCategory2FormCntrl: [''],
            jobCategory3FormCntrl: ['']
        });
        this.loading = true;
        this._workerService.lookupById(this.inputWorkerID)
            .subscribe(response => {
                this.loading = false;

                this.inputWorker = <Worker>response;

                this.showWorkerDataAction();

            }
                , error => {
                    this.loading = false;
                    let obj: Worker = error.error;
                    let err: BackendMessage = obj.error;
                    this.parseError(error.status, err);
                }
            );


    }

    ngOnChange() {
        this.showWorkerDataAction();

    }
    ngAfterViewInit() {
        this.cdRef.detectChanges();

    }
    showWorkerDataAction() {
        try {
            this.selectedWorkStation = new WorkStation();
            this.selectedWorkStation.id = this.inputWorker.workStation.id;
            let jc1List: JobCategory1[] = [];
            if (this.inputWorker.workerToJobsMaps.length == 0) {
                this._WorkerStationMgmService.lookupById(this.selectedWorkStation.id).subscribe(response => {
                    this.selectedWorkStation = <WorkStation>response;
                    this.selectedWorkStation.workStationJobs.forEach(element => {
                        this.jobCategory1List.push({ label: element.jobCategory1.name, value: element.jobCategory1 });
                    });
                    this.initJobCategory1List();
                });
            }
            else if (this.inputWorker.workerToJobsMaps.length > 0) {
                this.inputWorker.workerToJobsMaps.forEach(element => {
                    let jc1 = null;
                    let jc2 = null;
                    let jc3 = element.jobCategory3;
                    if (jc3 != null) {
                        jc2 = jc3.jobCategory2;
                        if (jc2 != null)
                            jc1 = jc2.jobCategory1;
                    }

                    if (jc1List.find(obj => obj.id === jc1.id) == undefined)
                        jc1List.push(jc1);
                });

                jc1List.forEach(element => {
                    this.jobCategory1List.push({ label: element.name, value: element });

                });
                this.initJobCategory1List();
            }
            this.selectedWorker = new Worker();
            this.selectedWorker.id = this.inputWorker.id;
            this.workerToJobMapList = [];
            this.inputWorker.workerToJobsMaps.forEach(element => {
                this.workerToJobMapList.push(element);
            });
            this.selectedWorker.workerToJobsMaps = this.workerToJobMapList;

        }
        catch (e) {
            console.log(e);
        }
    }
    initJobCategory1List() {
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
                            let err: BackendMessage = this.errorCntrler.handleError(error);
                            let errorMessages = this.errorCntrler.gMessage;
                            this.msgs = [];
                            errorMessages.forEach(element => {
                                this.msgs.push(element);
                            });
                        }
                        );
                }
            }
        }
    }
    initJobCategory3List() {
        this.editJobCategory3List = [];
        this.editJobCategory3List.push({ label: this.shared.allLabel, value: 0 });

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
                        let err: BackendMessage = this.errorCntrler.handleError(error);
                        let errorMessages = this.errorCntrler.gMessage;
                        this.msgs = [];
                        errorMessages.forEach(element => {
                            this.msgs.push(element);
                        });
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
                    this.errorCntrler.gMessage = [];
                    let err: BackendMessage = this.errorCntrler.handleError(error);
                    let errorMessages = this.errorCntrler.gMessage;
                    this.msgs = [];
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
                        //this.loading = false;
                        this.errorCntrler.gMessage = [];
                        let err: BackendMessage = this.errorCntrler.handleError(error);
                        let errorMessages = this.errorCntrler.gMessage;
                        this.msgs = [];
                        errorMessages.forEach(element => {
                            this.msgs.push(element);
                        });
                    });
            }
        });

    }



    onSubmit() {
        try {
            this.closePanel();
        }
        catch (e) {
            console.log(e);
        }
    }
    closePanel() {
        this.onClose.emit(false);

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