import { Component, Input, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { WorkTypeService } from '../../services/workTypes.service'
import { SharedValues } from '../../services/shared-values.service'
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { BackendMessage } from '../../entities/Msg.class'
import { HandleErrorMsg } from '../../shared/handleError.class'
import { GrowlMessage } from '../../entities/growlMessage.class'
import { WorkType } from '../../entities/WorkType.class'

@Component({
    moduleId: module.id,
    selector: 'workTypesComponent',
    templateUrl: './workTypes.template.html',
    providers: [WorkTypeService],
    styleUrls: ['../../../assets/css/dashboard.css']
})

export class WorkTypeMgmComponent implements OnInit {
    workTypes: WorkType[] = [];
    workType: WorkType = new WorkType();
    selectedWorkType: WorkType;
    newWorkType: boolean;
    showWorkTypeList: boolean = false;

    errorCntrler: HandleErrorMsg;
    hmsgs: GrowlMessage[] = [];
    innerPannelGMessage: GrowlMessage[] = [];
    displayDialog: boolean;
    showErrorMsg: boolean = false;
    errorMsg: string[] = [];
    showErrorMsgInPanel: boolean = false;
    errorMsgInPanel: string[] = [];

    form: FormGroup;
    loading: boolean = false;
    changeLabel = this.shared.changeLabel;
    activeLabel: string = this.shared.menuItem2SubItem2Label;
    onRowSelected: boolean = false;
    editedWorkType: WorkType;
    constructor(private _router: Router, 
        private _wService: WorkTypeService, private confirmationService: ConfirmationService,
        private _fb: FormBuilder, public shared: SharedValues) {
        this.errorCntrler = new HandleErrorMsg(_router)

    }
    ngOnInit() {
        this.form = this._fb.group({
            name: [this.workType.name, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(50)])]
        });

        this.rtvWorkTypeList();
    }

    rtvWorkTypeList() {
        this.loading = true;
        this._wService.getWorkTypesList()
            .subscribe(response => {
                this.showWorkTypeList = true;
                this.workTypes = <WorkType[]>response;
                this.loading = false;
            }
            , error => {
                this.showErrorMsg = true;
                this.showWorkTypeList = false;
                this.hmsgs = [];
                this.errorCntrler.gMessage = [];
                let obj: WorkType[] = error.error;
                let err: BackendMessage = obj[0].error;
                let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
                let errorMessages = this.errorCntrler.gMessage;
                errorMessages.forEach(element => {
                    this.hmsgs.push(element);
                });

                this.loading = false;
            }
            );
    }



    onRowSelect(event: any) {
        this.newWorkType = false;
        this.workType = this.cloneWorkType(event.data);
        this.displayDialog = true;
        this.innerPannelGMessage = [];
        this.showErrorMsgInPanel = false;
        this.form.clearValidators();
        this.form.markAsUntouched();
        this.form.controls['name'].clearAsyncValidators();
        this.form.controls['name'].clearValidators();
        this.onRowSelected = true;
    }
    edit(workt: WorkType) {
        this.workType = this.cloneWorkType(workt);
        this.editedWorkType = this.cloneWorkType(workt);
        this.innerPannelGMessage = [];
        this.newWorkType = false;
        this.displayDialog = true;
        this.form.clearValidators();
        this.form.markAsUntouched();
        this.onRowSelected = false;
    }
    cloneWorkType(wType: WorkType): WorkType {
        let workt = new WorkType();
        workt.id = wType.id;
        workt.name = wType.name;
        workt.error = wType.error;
        return workt;
    }

    showDialogToAdd() {
        this.newWorkType = true;
        this.workType = new WorkType();
        this.displayDialog = true;
        this.innerPannelGMessage = [];
        this.showErrorMsgInPanel = false;
        this.form.clearValidators();
        this.form.reset();
    }

    save(_workType: WorkType) {
        this.workType = _workType;
        this.loading = true;
        let wks = [...this.workTypes];

        if (this.newWorkType) {
            this._wService.addWorkType(this.workType)
                .subscribe(response => {
                    this.workType = <WorkType>response;
                    wks.push(this.workType);
                    this.workTypes = wks;
                    this.workType = null;
                    this.displayDialog = false;
                    this.loading = false;
                },
                error => {
                    this.showErrorMsgInPanel = true;
                    this.innerPannelGMessage = [];
                    this.errorCntrler.gMessage = [];
                    let obj: WorkType = error.error;
                    let err: BackendMessage = obj.error;
                    let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
                    let errorMessages = this.errorCntrler.gMessage;
                    this.innerPannelGMessage = this.errorCntrler.gMessage;
                    this.loading = false;
                });
        }
        else {
            this._wService.updateWorkType(this.workType)
                .subscribe(response => {
                    if (this.onRowSelected)
                        wks[this.findSelectedWorkTypeIndex()] = this.workType;
                    else {
                        wks[this.findWorkTypeIndex(this.editedWorkType)] = this.workType;
                    }
                    this.workTypes = wks;
                    this.displayDialog = false;
                    this.loading = false;
                },
                error => {
                    this.showErrorMsgInPanel = true;
                    this.innerPannelGMessage = [];
                    this.errorCntrler.gMessage = [];

                    let err: BackendMessage = error.error;
                    let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
                    let errorMessages = this.errorCntrler.gMessage;
                    this.innerPannelGMessage = this.errorCntrler.gMessage;
                    this.loading = false;
                });
        }

    }

    delete(workType: WorkType) {

        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                this.loading = true;
                this._wService.deleteWorkType(workType)
                    .subscribe(response => {
                        this.loading = false;
                        let index = this.findWorkTypeIndex(workType);
                        this.workTypes = this.workTypes.filter((val, i) => i != index);
                        this.displayDialog = false;
                    },
                    error => {
                        this.loading = false;
                        this.showErrorMsg = true;
                        this.innerPannelGMessage = [];
                        this.errorCntrler.gMessage = [];
                        let err: BackendMessage = error.error;
                        let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
                        let errorMessages = this.errorCntrler.gMessage;
                        this.innerPannelGMessage = this.errorCntrler.gMessage;
                    });
            }
        });

    }

    findWorkTypeIndex(workt: WorkType): number {
        for (let i = 0; i < this.workTypes.length; i++) {
            if (workt.id == this.workTypes[i].id)
                return i;
        }
        return -1;
    }
    findSelectedWorkTypeIndex(): number {
        return this.workTypes.indexOf(this.selectedWorkType);
    }



}