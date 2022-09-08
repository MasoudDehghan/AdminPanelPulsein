import { Component, Input, Output, OnInit, OnChanges, EventEmitter, ChangeDetectorRef } from '@angular/core'
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { HandleErrorMsg } from '../../shared/handleError.class'
import { BackendMessage } from '../../entities/Msg.class'
import { Router } from '@angular/router';
import { Worker } from '../../entities/worker.class'
import { WorkTime } from '../../entities/workTime.class'
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { GrowlMessage } from '../../entities/growlMessage.class'
import { SharedValues } from '../../services/shared-values.service'
import { WorkerMgmService } from '../../services/workerMgm.service'


@Component({
    moduleId: module.id,
    selector: 'editWorkerWorkingHourComponent',
    templateUrl: './editWrWorkingHour.template.html',
    styleUrls: ['../../../assets/css/dashboard.css'],
    providers:[WorkerMgmService]
})

export class EditWorkerWorkingHourComponent implements OnInit {
    @Input() inputWorkerID: number;
    @Output() onClose = new EventEmitter<boolean>();
    @Output() onSave = new EventEmitter<Worker>();

    inputWorker: Worker;
    selectedWorker: Worker = new Worker();
    loading: boolean = false;
    errorCntrler: HandleErrorMsg;

    selectedWorkTime: WorkTime;
    msgs: GrowlMessage[] = [];
    form: FormGroup;

    saturdayStartHour: number = 8;
    saturdayStartMinute: number = 0;
    saturdayStopHour: number = 17;
    saturdayStopMinute: number = 0;
    saturdayActive: boolean = true;
    sundayStartHour: number = 8;
    sundayStartMinute: number = 0;
    sundayStopHour: number = 17;
    sundayStopMinute: number = 0;
    sundayActive: boolean = true;
    mondayStartHour: number = 8;
    mondayStartMinute: number = 0;
    mondayStopHour: number = 17;
    mondayStopMinute: number = 0;
    mondayActive: boolean = true;
    tuesdayStartHour: number = 8;
    tuesdayStartMinute: number = 0;
    tuesdayStopHour: number = 17;
    tuesdayStopMinute: number = 0;
    tuesdayActive: boolean = true;
    wednesdayStartHour: number = 8;
    wednesdayStartMinute: number = 0;
    wednesdayStopHour: number = 17;
    wednesdayStopMinute: number = 0;
    wednesdayActive: boolean = true;
    thursdayStartHour: number = 8;
    thursdayStartMinute: number = 0;
    thursdayStopHour: number = 12;
    thursdayStopMinute: number = 30;
    thursdayActive: boolean = true;
    fridayStartHour: number = 8;
    fridayStartMinute: number = 0;
    fridayStopHour: number = 12;
    fridayStopMinute: number = 30;
    fridayActive: boolean = false;
    constructor(private _router: Router,
        private _fb: FormBuilder, 
        private _workerService: WorkerMgmService,
        public shared: SharedValues
    ) {

    }
    ngOnInit() {
        this.loading = true;


        let token: String = sessionStorage.getItem('token');
        this.errorCntrler = new HandleErrorMsg(this._router);

        this.loading = true;
        this._workerService.lookupById(this.inputWorkerID)
            .subscribe(response => {
                this.loading = false;

                this.inputWorker = <Worker>response;

                this.form = this._fb.group({
                    saturdayStartHourCntrl: [this.saturdayStartHour],
                    saturdayStartMinuteCntrl: [this.saturdayStartMinute],
                    saturdayStopHourCntrl: [this.saturdayStopHour],
                    saturdayStopMinuteCntrl: [this.saturdayStopMinute],
                    saturdayActiveCntrl: [this.saturdayActive],
                    sundayStartHourCntrl: [this.sundayStartHour],
                    sundayStartMinuteCntrl: [this.sundayStartMinute],
                    sundayStopHourCntrl: [this.sundayStopHour],
                    sundayStopMinuteCntrl: [this.sundayStopMinute],
                    sundayActiveCntrl: [this.sundayActive],
                    mondayStartHourCntrl: [this.mondayStartHour],
                    mondayStartMinuteCntrl: [this.mondayStartMinute],
                    mondayStopHourCntrl: [this.mondayStopHour],
                    mondayStopMinuteCntrl: [this.mondayStopMinute],
                    mondayActiveCntrl: [this.mondayActive],
                    tuesdayStartHourCntrl: [this.tuesdayStartHour],
                    tuesdayStartMinuteCntrl: [this.tuesdayStartMinute],
                    tuesdayStopHourCntrl: [this.tuesdayStopHour],
                    tuesdayStopMinuteCntrl: [this.tuesdayStopMinute],
                    tuesdayActiveCntrl: [this.tuesdayActive],
                    wednesdayStartHourCntrl: [this.wednesdayStartHour],
                    wednesdayStartMinuteCntrl: [this.wednesdayStartMinute],
                    wednesdayStopHourCntrl: [this.wednesdayStopHour],
                    wednesdayStopMinuteCntrl: [this.wednesdayStopMinute],
                    wednesdayActiveCntrl: [this.wednesdayActive],
                    thursdayStartHourCntrl: [this.thursdayStartHour],
                    thursdayStartMinuteCntrl: [this.thursdayStartMinute],
                    thursdayStopHourCntrl: [this.thursdayStopHour],
                    thursdayStopMinuteCntrl: [this.thursdayStopMinute],
                    thursdayActiveCntrl: [this.thursdayActive],
                    fridayStartHourCntrl: [this.fridayStartHour],
                    fridayStartMinuteCntrl: [this.fridayStartMinute],
                    fridayStopHourCntrl: [this.fridayStopHour],
                    fridayStopMinuteCntrl: [this.fridayStopMinute],
                    fridayActiveCntrl: [this.fridayActive]
                });
                this.init();
            }
                , error => {
                    this.loading = false;
                    let obj: Worker = error.error;
                    let err: BackendMessage = obj.error;
                    this.parseError(error.status, err);
                }
            );
      

    }


    init() {
        try {
            this.selectedWorker = new Worker();
            this.selectedWorker.id = this.inputWorker.id;
            this.selectedWorker.workTime = this.inputWorker.workTime;
            this.saturdayActive = this.selectedWorker.workTime.saActive;
            this.saturdayStartHour = this.selectedWorker.workTime.saStartH;
            this.saturdayStartMinute = this.selectedWorker.workTime.saStartM;
            this.saturdayStopHour = this.selectedWorker.workTime.saStopH;
            this.saturdayStopMinute = this.selectedWorker.workTime.saStopM;
            this.sundayActive = this.selectedWorker.workTime.suActive;
            this.sundayStartHour = this.selectedWorker.workTime.suStartH;
            this.sundayStartMinute = this.selectedWorker.workTime.suStartM;
            this.sundayStopHour = this.selectedWorker.workTime.suStopH;
            this.sundayStopMinute = this.selectedWorker.workTime.suStopM;
            this.mondayActive = this.selectedWorker.workTime.moActive;
            this.mondayStartHour = this.selectedWorker.workTime.moStartH;
            this.mondayStartMinute = this.selectedWorker.workTime.moStartM;
            this.mondayStopHour = this.selectedWorker.workTime.moStopH;
            this.mondayStopMinute = this.selectedWorker.workTime.moStopM;
            this.tuesdayActive = this.selectedWorker.workTime.tuActive;
            this.tuesdayStartHour = this.selectedWorker.workTime.tuStartH;
            this.tuesdayStartMinute = this.selectedWorker.workTime.tuStartM;
            this.tuesdayStopHour = this.selectedWorker.workTime.tuStopH;
            this.tuesdayStopMinute = this.selectedWorker.workTime.tuStopM;
            this.wednesdayActive = this.selectedWorker.workTime.weActive;
            this.wednesdayStartHour = this.selectedWorker.workTime.weStartH;
            this.wednesdayStartMinute = this.selectedWorker.workTime.weStartM;
            this.wednesdayStopHour = this.selectedWorker.workTime.weStopH;
            this.wednesdayStopMinute = this.selectedWorker.workTime.weStopM;
            this.thursdayActive = this.selectedWorker.workTime.thActive;
            this.thursdayStartHour = this.selectedWorker.workTime.thStartH;
            this.thursdayStartMinute = this.selectedWorker.workTime.thStartM;
            this.thursdayStopHour = this.selectedWorker.workTime.thStopH;
            this.thursdayStopMinute = this.selectedWorker.workTime.thStopM;
            this.fridayActive = this.selectedWorker.workTime.frActive;
            this.fridayStartHour = this.selectedWorker.workTime.frStartH;
            this.fridayStartMinute = this.selectedWorker.workTime.frStartM;
            this.fridayStopHour = this.selectedWorker.workTime.frStopH;
            this.fridayStopMinute = this.selectedWorker.workTime.frStopM;
            this.loading = false;
        }
        catch (e) {
            console.log(e);
        }
    }

    onSubmit() {
        try {
            this.loading = true;            
            this.selectedWorker.workTime.saActive = this.saturdayActive;
            this.selectedWorker.workTime.saStartH = this.saturdayStartHour;
            this.selectedWorker.workTime.saStartM = this.saturdayStartMinute;
            this.selectedWorker.workTime.saStopH = this.saturdayStopHour;
            this.selectedWorker.workTime.saStopM = this.saturdayStopMinute;
            this.selectedWorker.workTime.suActive = this.sundayActive;
            this.selectedWorker.workTime.suStartH = this.sundayStartHour;
            this.selectedWorker.workTime.suStartM = this.sundayStartMinute;
            this.selectedWorker.workTime.suStopH = this.sundayStopHour;
            this.selectedWorker.workTime.suStopM = this.sundayStopMinute;
            this.selectedWorker.workTime.moActive = this.mondayActive;
            this.selectedWorker.workTime.moStartH = this.mondayStartHour;
            this.selectedWorker.workTime.moStartM = this.mondayStartMinute;
            this.selectedWorker.workTime.moStopH = this.mondayStopHour;
            this.selectedWorker.workTime.moStopM = this.mondayStopMinute;
            this.selectedWorker.workTime.tuActive = this.tuesdayActive;
            this.selectedWorker.workTime.tuStartH = this.tuesdayStartHour;
            this.selectedWorker.workTime.tuStartM = this.tuesdayStartMinute;
            this.selectedWorker.workTime.tuStopH = this.tuesdayStopHour;
            this.selectedWorker.workTime.tuStopM = this.tuesdayStopMinute;
            this.selectedWorker.workTime.weActive = this.wednesdayActive;
            this.selectedWorker.workTime.weStartH = this.wednesdayStartHour;
            this.selectedWorker.workTime.weStartM = this.wednesdayStartMinute;
            this.selectedWorker.workTime.weStopH = this.wednesdayStopHour;
            this.selectedWorker.workTime.weStopM = this.wednesdayStopMinute;
            this.selectedWorker.workTime.thActive = this.thursdayActive;
            this.selectedWorker.workTime.thStartH = this.thursdayStartHour;
            this.selectedWorker.workTime.thStartM = this.thursdayStartMinute;
            this.selectedWorker.workTime.thStopH = this.thursdayStopHour;
            this.selectedWorker.workTime.thStopM = this.thursdayStopMinute;
            this.selectedWorker.workTime.frActive = this.fridayActive;
            this.selectedWorker.workTime.frStartH = this.fridayStartHour;
            this.selectedWorker.workTime.frStartM = this.fridayStartMinute;
            this.selectedWorker.workTime.frStopH = this.fridayStopHour;
            this.selectedWorker.workTime.frStopM = this.fridayStopMinute;
            console.log(this.selectedWorker);
            this._workerService.editWorkTime(this.selectedWorker)
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