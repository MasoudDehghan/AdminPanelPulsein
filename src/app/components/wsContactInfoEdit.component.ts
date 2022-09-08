import { Component, Input, Output, OnInit, OnChanges, EventEmitter, ChangeDetectorRef } from '@angular/core'
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { WorkStation } from '../entities/workStation.class'
import { WorkStationPhone } from '../entities/workStationPhone.class'
import { WorkerStationMgmService } from '../services/workerStationMgm.service'
import { HandleErrorMsg } from '../shared/handleError.class'
import { BackendMessage } from '../entities/Msg.class'
import { SelectItem } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { SharedValues } from '../services/shared-values.service'
import { GrowlMessage } from '../entities/growlMessage.class'
import { Constant } from '../shared/constants.class';


@Component({
    moduleId: module.id,
    selector: 'wsContactInfoComponent',
    templateUrl: './wsContactInfoEdit.template.html',
    styleUrls: ['../../assets/css/dashboard.css'],
    providers:[WorkerStationMgmService]
})

export class WorkStationContactInfoEdit implements OnInit {
    contactEditForm: FormGroup;
    @Input() inputWorkStation: WorkStation;
    @Input() filterPhoneTypeList: SelectItem[] = [];
    selectedWorkStation: WorkStation = new WorkStation();
    @Input() editMode: boolean = false;
    @Output() onClose = new EventEmitter<boolean>();
    @Output() onSave = new EventEmitter<WorkStation>();
    @Output() onDelete = new EventEmitter<WorkStation>();
    @Output() onError = new EventEmitter<string>();
    @Output() onShowWorkStationPhoneToAdd = new EventEmitter<WorkStation>();
    @Output() onShowWorkStationPhoneToEdit = new EventEmitter<WorkStation>();

    workStation: WorkStation = new WorkStation();
    panelWorkStation: WorkStation = new WorkStation();
    landLineTelNumber: number;
    mobileNumber: number;
    faxNumber: number;
    workStationPhoneList: WorkStationPhone[] = [];
    loading: boolean = false;
    errorCntrler: HandleErrorMsg;
    msgs: GrowlMessage[] = [];

    workStationPhone: WorkStationPhone = new WorkStationPhone();


    constructor(private _fb: FormBuilder, private cdRef: ChangeDetectorRef,
        private confirmationService: ConfirmationService, public shared: SharedValues,
        private _dService: WorkerStationMgmService) {

    }
    ngOnInit() {
        this.loading = true;
        this.contactEditForm = this._fb.group({
            landLineTelNumber: [this.landLineTelNumber],
            mobileNumber: [this.mobileNumber],
            faxNumber: [this.faxNumber],
            website: [this.workStation.website, Validators.pattern(Constant.websiteRgx)],
            email: [this.workStation.email, Validators.pattern(Constant.emailRegx)],
            telegram: [this.workStation.telegram, Validators.pattern('^(@)[A-Za-z0-9]{2,100}$')],
            instagram: [this.workStation.instagram]
        });
    }
    ngOnChanges() {
        this.init();
    }
    ngAfterViewInit() {
        this.loading = false;
        this.cdRef.detectChanges();

    }
    showPhoneDialogToAdd() {
        this.onShowWorkStationPhoneToAdd.emit(this.selectedWorkStation);

    }

    init() {
        this.showContactDataAction();
    }
    onWorkStationPhoneListRowSelect(event) {
        if (this.editMode) {
            this.workStationPhone = this.CloneWorkStationPhone(event.data);

            let oWorkStation = new WorkStation();
            oWorkStation.id = this.inputWorkStation.id;
            oWorkStation.title = this.inputWorkStation.title;
            oWorkStation.workType = this.inputWorkStation.workType;
            oWorkStation.workStationPhones = [];
            oWorkStation.workStationPhones[0] = this.CloneWorkStationPhone(this.workStationPhone);
            this.onShowWorkStationPhoneToEdit.emit(oWorkStation);
        }
    }
    removeWorkStationPhone2(ws: WorkStation, wp: WorkStationPhone) {
        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                this.loading = true;
                this.selectedWorkStation.workStationPhones = [];
                let _workStationPhones = [...this.selectedWorkStation.workStationPhones];
                _workStationPhones[0] = wp;
                this.selectedWorkStation.workStationPhones = _workStationPhones;
                this._dService.deletePhone(this.selectedWorkStation)
                    .subscribe(response => {
                        let ws:WorkStation = <WorkStation>response;
                        this.loading = false;
                        this.onSave.emit(ws);
                        _workStationPhones = ws.workStationPhones;
                        this.selectedWorkStation.workStationPhones = _workStationPhones;
                    },
                    error => {
                        let err: BackendMessage = error.error;
                        this.parseError(error.status, err);
                        this.loading = false;
                    });
            }
        });
    }

    CloneWorkStationPhone(wp: WorkStationPhone) {
        let workStationPhone = new WorkStationPhone();
        for (let prop in wp) {
            workStationPhone[prop] = wp[prop];
            workStationPhone.phoneType = wp.phoneType;
            workStationPhone.phoneType.id = wp.phoneType.id;
            workStationPhone.phoneType.name = wp.phoneType.name;
        }

        return workStationPhone;
    }
    showContactDataAction() {
        this.selectedWorkStation = new WorkStation();
        this.selectedWorkStation.id = this.inputWorkStation.id;
        this.selectedWorkStation.title = this.inputWorkStation.title;
        this.selectedWorkStation.workType = this.inputWorkStation.workType;
        this.selectedWorkStation.workStationPhones = [];
        let _workStationPhones = [...this.selectedWorkStation.workStationPhones];

        let iii = 0;
        this.inputWorkStation.workStationPhones.forEach(element => {
            _workStationPhones[iii] = element;
            iii++;
        });
        this.selectedWorkStation.workStationPhones = _workStationPhones;

        this.selectedWorkStation.website = this.inputWorkStation.website;
        this.selectedWorkStation.email = this.inputWorkStation.email;
        this.selectedWorkStation.telegram = this.inputWorkStation.telegram;
        this.selectedWorkStation.instagram = this.inputWorkStation.instagram;
    }

    onSubmitContactform() {
        if (this.editMode) {
            this.loading = true;
            this._dService.editContact(this.selectedWorkStation)
                .subscribe(response => {
                    this.onSave.emit(<WorkStation>response);
                    this.loading = false;
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