import { Component, Input, Output, OnInit, OnChanges, EventEmitter, ChangeDetectorRef } from '@angular/core'
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'

import * as glob from '../shared/global';
import { WorkStation } from '../entities/workStation.class'
import { WorkerStationMgmService } from '../services/workerStationMgm.service'
import { HandleErrorMsg } from '../shared/handleError.class'
import { BackendMessage } from '../entities/Msg.class'
import { SelectItem } from 'primeng/primeng';
import { Router } from '@angular/router';
import { GrowlMessage } from '../entities/growlMessage.class'

@Component({
    moduleId: module.id,
    selector: 'wsPersonalInfoComponent',
    templateUrl: './wsPersonalInfoEdit.template.html',
    styleUrls: ['../../assets/css/dashboard.css'],
    providers:[WorkerStationMgmService]
})

export class WorkStationPersonalInfoEdit implements OnInit {
    personalEditForm: FormGroup;
    @Input() inputWorkStation: WorkStation;
    @Input() positionTypeList: SelectItem[];
    @Input() loading:boolean = false;
    selectedWorkStation: WorkStation = new WorkStation();
    @Input() editMode: boolean = false;
    @Output() onClose = new EventEmitter<boolean>();
    @Output() onSave = new EventEmitter<WorkStation>();

    workStation: WorkStation = new WorkStation();
    errorCntrler: HandleErrorMsg;
    saveLabel = glob.saveLabelFa;
    closeLabel = glob.closeLabel;
    successFullChangeMsg = glob.successFullChangeMsg;
    workStationLabelFa = glob.workStationLabelFa;
    firstNameLabel = glob.firstNameLabel;
    lastNameLabel = glob.lastNameLabel;
    genderLabel = glob.genderLabel;
    nationalCodeLabel = glob.nationalCodeLabel;
    positionLabel = glob.positionLabel;
    InnerCode_InvalidLastNameMsg = glob.InnerCode_InvalidLastNameMsg;
    InnerCode_InvalidNameMsg = glob.InnerCode_InvalidNameMsg;
    invalidNationalCodeMsg = glob.invalidNationalCodeMsg;
    manLabel = glob.manLabel;
    womanLabel = glob.womanLabel;
    msgs: GrowlMessage[] = [];
    workStationFirstName: string = "";
    workStationLastName: string = "";
    workStationNationalCode: string = "";
    constructor(private _router: Router, private _fb: FormBuilder, private cdRef: ChangeDetectorRef, private _dService: WorkerStationMgmService) {
    }
    ngOnInit() {
        this.personalEditForm = this._fb.group({
            firstName: new FormControl([this.workStation.owner.firstName]),
            lastName: new FormControl([this.workStation.owner.lastName], Validators.required),
            nationalCode: new FormControl([this.workStation.owner.nationalCode], Validators.pattern('^[0-9]{10}$')),
            positionType: new FormControl([this.workStation.ownerPosition])

        });
        this.errorCntrler = new HandleErrorMsg(this._router);
        this.msgs = [];
    }
    ngOnChanges() {
        this.showPersonalDataAction();
    }
    ngAfterViewInit() {
        this.cdRef.detectChanges();

    }
    showPersonalDataAction() {
        try {
            this.selectedWorkStation = new WorkStation();
            this.selectedWorkStation.id = this.inputWorkStation.id;
            this.selectedWorkStation.title = this.inputWorkStation.title;
            this.selectedWorkStation.workType = this.inputWorkStation.workType;
            this.selectedWorkStation.owner.firstName = this.inputWorkStation.owner.firstName;
            this.selectedWorkStation.owner.lastName = this.inputWorkStation.owner.lastName;
            this.selectedWorkStation.owner.nationalCode = this.inputWorkStation.owner.nationalCode;
            this.selectedWorkStation.ownerPosition = this.inputWorkStation.ownerPosition;
        }
        catch (e) {
            console.log(e);
        }
    }


    onSubmitPersonalform() {
        if (this.editMode) {

            if (this.personalEditForm.controls['nationalCode'].hasError('pattern')) {
                this.msgs.push({ severity: 'error', summary: glob.errorLabel, detail: this.invalidNationalCodeMsg });
                return;
            }
            this.loading = true;
            this._dService.editOwnerInfo(this.selectedWorkStation)
                .subscribe(response => {
                    this.loading = false;
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