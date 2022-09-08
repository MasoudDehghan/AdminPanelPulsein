import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { SelectItem } from 'primeng/primeng'
import { GrowlMessage } from '../../entities/growlMessage.class'
import { BackendMessage } from '../../entities/Msg.class'
import { Worker } from '../../entities/worker.class'
import { SharedValues } from '../../services/shared-values.service'
import { WorkerMgmService } from '../../services/workerMgm.service'
import { HandleErrorMsg } from '../../shared/handleError.class'


@Component({
    moduleId: module.id,
    selector: 'editWorkerRegisterStateComponent',
    templateUrl: './editWrRegisterState.template.html',
    styleUrls: ['../../../assets/css/dashboard.css'],
    providers:[WorkerMgmService]
})

export class EditWorkerRegisterStateComponent implements OnInit {
    registerStateForm: FormGroup;
    @Input() inputWorkerID: number;
    @Input() editMode: boolean = false;
    @Input() registerStateList: SelectItem[] = [];
    @Output() onClose = new EventEmitter<boolean>();
    @Output() onSave = new EventEmitter<Worker>();
    inputWorker: Worker;
    selectedWorker: Worker = new Worker();

    loading: boolean = false;
    errorCntrler: HandleErrorMsg;

    msgs: GrowlMessage[] = [];

    constructor(private _router: Router, private _fb: FormBuilder,
        private _workerService: WorkerMgmService,
        public shared: SharedValues) {

    }
    ngOnInit() {
        this.errorCntrler = new HandleErrorMsg(this._router);
        this.loading = true;
        this._workerService.lookupById(this.inputWorkerID)
            .subscribe(response => {
                this.loading = false;

                this.inputWorker = <Worker>response;

                this.registerStateForm = this._fb.group({
                    state: [this.inputWorker.registerState],
                    desc: [this.inputWorker.regStateInfo],
                    haveBond:[this.inputWorker.haveBond],
                    offerBlock:[this.inputWorker.offerBlock]
                });
                this.showAction();
            }
                , error => {
                    this.loading = false;
                    let obj: Worker = error.error;
                    let err: BackendMessage = obj.error;
                    this.parseError(error.status, err);
                }
            );

    }



    showAction() {
        try {
            this.selectedWorker = new Worker();
            this.selectedWorker.id = this.inputWorker.id;
            this.selectedWorker.registerState = this.inputWorker.registerState;
            this.selectedWorker.regStateInfo = this.inputWorker.regStateInfo;
            this.selectedWorker.offerBlock = this.inputWorker.offerBlock;
            this.selectedWorker.haveBond = this.inputWorker.haveBond;
        }
        catch (e) {
            console.log(e);
        }
    }

    onSubmit() {
        try {
            if (this.editMode) {

                this.loading = true;
                this._workerService.editRegisterState(this.selectedWorker)
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