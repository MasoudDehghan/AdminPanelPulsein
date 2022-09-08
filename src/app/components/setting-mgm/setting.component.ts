import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomeSetting } from '../../entities/customSetting.class';
import { GrowlMessage } from '../../entities/growlMessage.class';
import { BackendMessage } from '../../entities/Msg.class';
import { Setting } from '../../entities/setting.class';
import { SettingService } from '../../services/setting.service';
import { SharedValues } from '../../services/shared-values.service';
import { HandleErrorMsg } from '../../shared/handleError.class';

@Component({
    moduleId: module.id,
    selector: 'settingComponent',
    templateUrl: './setting.template.html',
    providers: [SettingService],
    styleUrls: ['../../../assets/css/dashboard.css']
})

export class SettingMgmComponent implements OnInit {
    settingList: CustomeSetting[] = [];
    setting: CustomeSetting = new CustomeSetting();
    selectedSetting: CustomeSetting;

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

    activeLabel: string = this.shared.settingLabel;

    onRowSelected: boolean = false;
    editedSetting: CustomeSetting;
    selectedValue: string;
    constructor(private _router: Router,
        private _dService: SettingService,
        private _fb: FormBuilder, public shared: SharedValues) {
        this.errorCntrler = new HandleErrorMsg(_router);
    }
    ngOnInit() {
        this.form = this._fb.group({
            name: [this.setting.name, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
            value: [],
            unit: [this.setting.unit]
        });

        this.rtvList();
    }

    rtvList() {
        this.loading = true;
        
        this._dService.getAll()
            .subscribe(response => {

                this.settingList = <CustomeSetting[]>response;
                let dts = [...this.settingList];
                this.settingList.forEach(setting=>{
                    let customeSetting:CustomeSetting = new CustomeSetting();
                    if(setting.typeString)
                        customeSetting.valuex = setting.svalue;
                    else
                        customeSetting.valuex = setting.fvalue.toString();
                    customeSetting.id = setting.id;
                    customeSetting.name = setting.name;
                    customeSetting.unit = setting.unit;
                    customeSetting.typeString = setting.typeString;
                    customeSetting.svalue = setting.svalue;
                    customeSetting.fvalue = setting.fvalue;
                    let i = this.findSettingTypeIndexz(dts,customeSetting);
                    this.settingList[i] = customeSetting;
                });

                this.loading = false;
            }
                , error => {
                    this.showErrorMsg = true;
                    this.hmsgs = [];
                    this.errorCntrler.gMessage = [];
                    let obj: Setting[] = error.error;
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
        this.setting = this.cloneSetting(event.data);
        this.displayDialog = true;
        this.innerPannelGMessage = [];
        this.showErrorMsgInPanel = false;
        this.form.clearValidators();
        this.form.markAsUntouched();
        this.form.controls['name'].clearAsyncValidators();
        this.form.controls['name'].clearValidators();
        this.onRowSelected = true;
    }
    edit(setting: CustomeSetting) {
        this.setting = this.cloneSetting(setting);
        this.editedSetting = this.cloneSetting(setting);
        this.displayDialog = true;
        this.form.clearValidators();
        this.form.markAsUntouched();
        this.onRowSelected = false;
        if (this.editedSetting.typeString)
            this.selectedValue = this.editedSetting.svalue;
        else
            this.selectedValue = this.editedSetting.fvalue.toString();
    }
    cloneSetting(_setting: CustomeSetting): CustomeSetting {
        let setting = new CustomeSetting();
        setting.id = _setting.id;
        setting.name = _setting.name;
        setting.svalue = _setting.svalue;
        setting.fvalue = _setting.fvalue;
        setting.typeString = _setting.typeString;
        setting.unit = _setting.unit;
        return setting;
    }

    showDialogToAdd() {
        this.setting = new CustomeSetting();
        this.innerPannelGMessage = [];
        this.showErrorMsgInPanel = false;
        this.displayDialog = true;
        this.form.clearValidators();
        this.form.reset();
    }

    save() {
        try {
            if (!this.form.valid)
                throw new Error("Invalid Form Data");
            if (this.setting.typeString)
                this.setting.svalue = this.selectedValue;
            else{
               
                    this.setting.fvalue = Number.parseFloat(this.selectedValue);            
                    if(Number.isNaN(this.setting.fvalue)){
                        this.hmsgs.push({ severity: 'error', summary: this.shared.errorLabel, detail: this.shared.invalidInputMsg });
                        return;
                    }
            }
            this.loading = true;
            
            let dts = [...this.settingList];


            this._dService.edit(this.setting)
                .subscribe(response => {
                    this.setting.valuex = this.selectedValue;
                    if (this.onRowSelected)
                        dts[this.findSelectedSettingIndex()] = this.setting;
                    else
                        dts[this.findSettingTypeIndex(this.editedSetting)] = this.setting;
                    this.settingList = dts;
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
        catch (e) {
            console.log(e);
        }
    }



    findSettingTypeIndex(setting: CustomeSetting): number {
        for (let i = 0; i < this.settingList.length; i++) {
            if (setting.id == this.settingList[i].id)
                return i;
        }
        return -1;
    }
    findSettingTypeIndexz(x:CustomeSetting[],setting: CustomeSetting): number {
        for (let i = 0; i < x.length; i++) {
            if (setting.id == x[i].id)
                return i;
        }
        return -1;
    }
    findSelectedSettingIndex(): number {
        return this.settingList.indexOf(this.selectedSetting);
    }


}