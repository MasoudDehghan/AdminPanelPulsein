import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { GrowlMessage } from '../../entities/growlMessage.class';
import { BackendMessage } from '../../entities/Msg.class';
import { SubscriptionType } from '../../entities/SubscriptionType.class';
import { SharedValues } from '../../services/shared-values.service';
import { SubscribtionTypeService } from '../../services/subscribtionTypes.service';
import { CustomValidators } from '../../shared/custome-validators.class';
import { HandleErrorMsg } from '../../shared/handleError.class';



@Component({
    moduleId: module.id,
    selector: 'subscribtionTypesComponent',
    templateUrl: './subscribtionTypes.template.html',
    providers: [SubscribtionTypeService],
    styleUrls: ['../../../assets/css/dashboard.css']
})

export class SubscribtionTypeMgmComponent implements OnInit {
    subTypes: SubscriptionType[] = [];
    subType: SubscriptionType = new SubscriptionType();
    selectedSubscriptionType: SubscriptionType;
    newSubscriptionType: boolean;
    showSubTypeList: boolean = false;

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

    activeLabel: string = this.shared.menuItem2SubItem5Label;
    onRowSelected: boolean = false;
    editedSubscriptionType: SubscriptionType;
    constructor(private _router: Router, 
        private _dService: SubscribtionTypeService, private confirmationService: ConfirmationService,
        private _fb: FormBuilder, public shared: SharedValues) {
        this.errorCntrler = new HandleErrorMsg(_router)
    }
    ngOnInit() {
        this.form = this._fb.group({
            name: [this.subType.name,
            Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
            jobPricePercent: [this.subType.jobPricePercent, Validators.required, CustomValidators.percentFormat],
            notificationPercent: [this.subType.notificationPercent, Validators.required, CustomValidators.percentFormat],
            notificationPrice: [this.subType.notificationPrice,
            Validators.compose([Validators.required, Validators.pattern('^[0-9][0-9]*$')])],
            price: [this.subType.price,
            Validators.compose([Validators.required, Validators.pattern('^[0-9][0-9]*$')])],
        });

        this.rtvSubTypeList();
    }

    rtvSubTypeList() {
        this.loading = true;
        this._dService.getSubscribtionTypesList()
            .subscribe(response => {
                this.showSubTypeList = true;
                this.subTypes = <SubscriptionType[]>response;
                this.loading = false;
            }
            , error => {
                this.showErrorMsg = true;
                this.showSubTypeList = false;
                this.hmsgs = [];
                this.errorCntrler.gMessage = [];
                let obj: SubscriptionType[] = error.error;
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
        this.newSubscriptionType = false;
        this.innerPannelGMessage = [];
        this.showErrorMsgInPanel = false;
        this.subType = this.cloneSubType(event.data);
        this.displayDialog = true;
        this.form.clearValidators();
        this.form.markAsUntouched();
        this.onRowSelected = true;

    }
    edit(subt: SubscriptionType) {
        this.subType = this.cloneSubType(subt);
        this.editedSubscriptionType = this.cloneSubType(subt);
        this.newSubscriptionType = false;
        this.innerPannelGMessage = [];
        this.showErrorMsgInPanel = false;
        this.displayDialog = true;
        this.form.clearValidators();
        this.form.markAsUntouched();
        this.onRowSelected = false;
    }
    cloneSubType(subType: SubscriptionType): SubscriptionType {
        let subt = new SubscriptionType();
        subt.id = subType.id;
        subt.jobPricePercent = subType.jobPricePercent;
        subt.name = subType.name;
        subt.notificationPercent = subType.notificationPercent;
        subt.notificationPrice = subType.notificationPrice;
        subt.price = subType.price;
        return subt;
    }

    showDialogToAdd() {
        this.newSubscriptionType = true;
        this.innerPannelGMessage = [];
        this.showErrorMsgInPanel = false;
        this.subType = new SubscriptionType();
        this.displayDialog = true;
        this.form.clearValidators();
        this.form.reset();
    }

    save() {
        this.loading = true;
        let sbts = [...this.subTypes];
        if (this.newSubscriptionType) {
            this._dService.addSubscribtionType(this.subType)
                .subscribe(response => {
                    this.subType = <SubscriptionType>response;
                    sbts.push(this.subType);
                    this.subTypes = sbts;
                    this.subType = null;
                    this.displayDialog = false;
                    this.loading = false;
                },
                error => {
                    this.showErrorMsgInPanel = true;
                    this.innerPannelGMessage = [];
                    this.errorCntrler.gMessage = [];
                    let obj: SubscriptionType = error.error;
                    let err: BackendMessage = obj.error;
                    let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
                    let errorMessages = this.errorCntrler.gMessage;
                    this.innerPannelGMessage = this.errorCntrler.gMessage;
                    this.loading = false;

                });
        }
        else {
            this._dService.updateSubType(this.subType)
                .subscribe(response => {
                    if (this.onRowSelected)
                        sbts[this.findSelectedSubTypeIndex()] = this.subType;
                    else
                        sbts[this.findSubTypeIndex(this.editedSubscriptionType)] = this.subType;
                    this.subTypes = sbts;
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

    delete(subType: SubscriptionType) {

        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                this.loading = true;
                this._dService.deleteSubType(subType)
                    .subscribe(response => {
                        this.loading = false;
                        let index = this.findSubTypeIndex(subType);
                        this.subTypes = this.subTypes.filter((val, i) => i != index);
                        this.displayDialog = false;
                    },
                    error => {
                        this.showErrorMsg = true;
                        this.innerPannelGMessage = [];
                        this.errorCntrler.gMessage = [];
                        let err: BackendMessage = error.error;
                        let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
                        let errorMessages = this.errorCntrler.gMessage;
                        this.innerPannelGMessage = this.errorCntrler.gMessage;
                        this.loading = false;
                    });
            }
        });

    }

    findSubTypeIndex(subt: SubscriptionType): number {
        for (let i = 0; i < this.subTypes.length; i++) {
            if (subt.id == this.subTypes[i].id)
                return i;
        }
        return -1;
    }
    findSelectedSubTypeIndex(): number {
        return this.subTypes.indexOf(this.selectedSubscriptionType);
    }


}