import { Component, Input, Output, OnInit, OnChanges, EventEmitter, ChangeDetectorRef } from '@angular/core'
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'

import * as glob from '../shared/global';
import { WorkStation } from '../entities/workStation.class'
import { WorkerStationMgmService } from '../services/workerStationMgm.service'
import { HandleErrorMsg } from '../shared/handleError.class'
import { BackendMessage } from '../entities/Msg.class'
import { SelectItem } from 'primeng/primeng';
import { Router } from '@angular/router';
import { JobCategory1 } from '../entities/JobCategory1.class'
import { WorkStationJob } from '../entities/workStationJob.class'
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { GrowlMessage } from '../entities/growlMessage.class'


@Component({
    moduleId: module.id,
    selector: 'wsJobInfoComponent',
    templateUrl: './wsJobInfoEdit.template.html',
    styleUrls: ['../../assets/css/dashboard.css'],
    providers:[WorkerStationMgmService]
})

export class WorkStationJobInfoEdit implements OnInit {
    @Input() inputWorkStation: WorkStation;
    selectedWorkStation: WorkStation = new WorkStation();
    @Input() editMode: boolean = false;
    @Input() jobCategory1List: SelectItem[] = [];
    _jobCategory1List: SelectItem[] = [];

    @Output() onClose = new EventEmitter<boolean>();
    @Output() onSave = new EventEmitter<WorkStation>();
    @Output() onDelete = new EventEmitter<WorkStation>();
    form: FormGroup;
    showStorePanel = false;
    showCompanyPanel = false;
    workStation: WorkStation = new WorkStation();
    @Input() loading: boolean = false;
    errorCntrler: HandleErrorMsg;

    saveLabel = glob.saveLabelFa;
    closeLabel = glob.closeLabel;
    successFullChangeMsg = glob.successFullChangeMsg;
    workStationLabelFa = glob.workStationLabelFa;
    job_Category1Label = glob.job_Category1Label;
    emptyWorkJobListMsg = glob.emptyWorkJobListMsg;
    confirmHeader = glob.confirmHeader;
    yesLabel = glob.yesLabel;
    noLabel = glob.noLabel;
    delLabelFa = glob.delLabelFa;
    addLabel = glob.addLabel;
    allLabel = glob.allLabel;
    chooseJC1Msg = glob.chooseJC1Msg;
    selectedWorkerStationJobs: WorkStationJob;
    selectedJobCategory1: JobCategory1 = null;
    selectedJobCategory1ID: number = 0;

    msgs: GrowlMessage[] = [];

    constructor(private _router: Router,
        private _fb: FormBuilder, private cdRef: ChangeDetectorRef, private _dService: WorkerStationMgmService,
        private confirmationService: ConfirmationService,
    ) {

    }
    ngOnInit() {
        this.errorCntrler = new HandleErrorMsg(this._router);
        this.form = this._fb.group({
            jobCategory1FormCntrl: ['']
        });
        this.showJobDataAction();

    }

    ngOnChange() {
        this.showJobDataAction();
    }
    ngAfterViewInit() {
        this.cdRef.detectChanges();

    }
    showJobDataAction() {
        try {

            this.selectedWorkStation = new WorkStation();
            this.selectedWorkStation.id = this.inputWorkStation.id;
            this.selectedWorkStation.title = this.inputWorkStation.title;
            this.selectedWorkStation.workType = this.inputWorkStation.workType;
            this.selectedWorkStation.name = this.inputWorkStation.name;
            this.selectedWorkStation.workStationJobs = this.inputWorkStation.workStationJobs;
            this._jobCategory1List = [];
            this.jobCategory1List.forEach(element => {
                if (element.value != null) {
                    if (element.value != 0) {
                        this._jobCategory1List.push(element);
                    }
                }

            });
        }
        catch (e) {
            console.log(e);
        }
    }

    onSubmit() {
        try {
            if (this.editMode) {
                if (this.selectedWorkStation.workStationJobs.length == 0) {
                    this.msgs.push({ severity: 'error', summary: glob.errorLabel, detail: glob.InnerCode_EmptyJobsListMsg });
                    throw new Error(glob.InnerCode_EmptyJobsListMsg);
                }
                let _workStationJobs = [...this.selectedWorkStation.workStationJobs];
                this.loading = true;
                let ws: WorkStation = new WorkStation();
                ws.id = this.selectedWorkStation.id;
                let wj: WorkStationJob = new WorkStationJob();
                wj.jobCategory1 = this.selectedJobCategory1;
                ws.workStationJobs[0] = wj;
                this._dService.addJob(ws).subscribe(response => {
                    this.loading = false;
                    _workStationJobs.push(wj);
                    this.selectedWorkStation.workStationJobs = _workStationJobs;
                    this.onSave.emit(<WorkStation>response);
                },
                    error => {
                        let obj: WorkStation = error.error;
                        let err: BackendMessage = obj.error;
                        this.parseError(error.status, err);
                        this.loading = false;

                    });
            }
            else
                this.onClose.emit(false);
        }
        catch (e) {
            console.log(e);
        }
    }
    closePanel() {
        this.onClose.emit(false);

    }
    removeWorkStationJob(wj: WorkStationJob) {
        if (this.editMode) {
            this.confirmationService.confirm({
                message: glob.confirmText,
                accept: () => {
                    this.loading = true;
                    let ws: WorkStation = new WorkStation();
                    ws.id = this.selectedWorkStation.id;
                    ws.workStationJobs[0] = wj;
                    this.selectedWorkerStationJobs = wj;
                    this._dService.deleteJob(this.selectedWorkStation)
                        .subscribe(response => {
                            this.loading = false;
                            let index = this.findSelectedWJIndex();
                            this.selectedWorkStation.workStationJobs =
                                this.selectedWorkStation.workStationJobs.filter((val, i) => i != index);
                            this.onDelete.emit(<WorkStation>response);
                            this.selectedWorkerStationJobs = null;
                        },
                        error => {
                            let err: BackendMessage = error.error;
                            this.parseError(error.status, err);
                            this.loading = false;
                        });
                }
            });

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
    findSelectedWJIndex(): number {
        return this.selectedWorkStation.workStationJobs.indexOf(this.selectedWorkerStationJobs);
    }
}