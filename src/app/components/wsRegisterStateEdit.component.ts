import { Component, Input, Output, OnInit, OnChanges, EventEmitter, ChangeDetectorRef } from '@angular/core'
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'

import { WorkStation } from '../entities/workStation.class'
import { WorkerStationMgmService } from '../services/workerStationMgm.service'
import { HandleErrorMsg } from '../shared/handleError.class'
import { BackendMessage } from '../entities/Msg.class'
import { SelectItem } from 'primeng/primeng';
import { Router } from '@angular/router';
import { GrowlMessage } from '../entities/growlMessage.class'
import { SharedValues } from '../services/shared-values.service'

@Component({
    moduleId: module.id,
    selector: 'wsRegisterInfoComponent',
    templateUrl: './wsRegisterStateEdit.template.html',
    styleUrls: ['../../assets/css/dashboard.css'],
    providers: [WorkerStationMgmService]

})

export class WorkStationRegisterStateEdit implements OnInit {
    registerStateForm: FormGroup;
    @Input() inputWorkStation: WorkStation;
    selectedWorkStation: WorkStation = new WorkStation();
    @Input() editMode: boolean = false;
    @Input() registerStateList: SelectItem[] = [];
    @Input() loading = false;
    @Output() onClose = new EventEmitter<boolean>();
    @Output() onSave = new EventEmitter<WorkStation>();


    workStation: WorkStation = new WorkStation();
    errorCntrler: HandleErrorMsg;

    msgs: GrowlMessage[] = [];

    constructor(private _router: Router, private _fb: FormBuilder,
        private cdRef: ChangeDetectorRef, private _dService: WorkerStationMgmService,
        public shared: SharedValues) {

    }
    ngOnInit() {
        let token: String = sessionStorage.getItem('token');
        this.errorCntrler = new HandleErrorMsg(this._router);


    }
    ngOnChanges() {
        this.registerStateForm = this._fb.group({
            state: [this.selectedWorkStation.registerState],
            desc: [this.selectedWorkStation.regStateInfo]
        });
        this.init();
    }
    ngAfterViewInit() {
        this.cdRef.detectChanges();

    }
    init() {
        this.showAction();
    }


    showAction() {
        try {
            this.selectedWorkStation = new WorkStation();
            this.selectedWorkStation.id = this.inputWorkStation.id;
            this.selectedWorkStation.registerState = this.inputWorkStation.registerState;
            this.selectedWorkStation.regStateInfo = this.inputWorkStation.regStateInfo;


        }
        catch (e) {
            console.log(e);
        }
    }

    onSubmit() {
        try {
            if (this.editMode) {

                this.loading = true;
                this._dService.editRegisterState(this.selectedWorkStation)
                    .subscribe(response => {
                        this.loading = false;
                        console.log(response);
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