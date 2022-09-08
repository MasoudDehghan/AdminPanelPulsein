import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, DataTable, SelectItem } from 'primeng/primeng';
import { Md5 } from 'ts-md5/dist/md5';
import { BasicData } from '../../entities/basicData.class';
import { ClientExcelView } from '../../entities/clientExcel.class';
import { GrowlMessage } from '../../entities/growlMessage.class';
import { BackendMessage } from '../../entities/Msg.class';
import { Sms } from '../../entities/sms.class';
import { User } from '../../entities/user.class';
import { UserRoleEnum } from '../../enums/userRole.enum';
import { ExcelService } from '../../services/excel.service';
import { SharedFunctions } from '../../services/shared-functions.service';
import { SharedValues } from '../../services/shared-values.service';
import { UsersService } from '../../services/users.service';
import { Constant } from '../../shared/constants.class';
import { CustomValidators } from '../../shared/custome-validators.class';
import { HandleErrorMsg } from '../../shared/handleError.class';
import { environment } from './../../../environments/environment';
@Component({
    moduleId: module.id,
    selector: 'usersWrComponent',
    templateUrl: './users-wr.template.html',
    providers: [UsersService, ExcelService],
    styleUrls: ['../../../assets/css/dashboard.css']
})

export class UsersWorkerMgmComponent implements OnInit {
    activeLabel: string = this.shared.appWorkertUsersLabel;
    errorCntrler: HandleErrorMsg;
    gMessage: GrowlMessage[] = [];
    innerPannelGMessage: GrowlMessage[] = [];
    users: User[] = [];
    systemUsers: User[] = [];
    workerUsers: User[] = [];
    selectedUser: User;
    editedUser: User;
    newUser: boolean;
    user: User = new User();
    displayDialog: boolean;
    displayChangePassDialog: boolean = false;
    displayDetailViewDialog: boolean = false;
    showErrorMsg: boolean = false;
    errorMsg: string[] = [];
    roleList: SelectItem[];
    filteredRegisterStateList: SelectItem[];
    registerStateList: SelectItem[];
    yearList: SelectItem[];
    selectedRole: string;
    showErrorMsgInPanel: boolean = false;
    errorMsgInPanel: string[] = [];
    form: FormGroup;
    changePassForm: FormGroup;
    showUsersList: boolean = false;
    loading: boolean = false;
    rePassword: string;
    dialogHeader: string;
    uploadURL: string;
    uploadedImageName: string = "";
    uploadedFiles: any[] = [];
    baseImagePath = environment.fileServerUrl;
    selectedUserImagePath: String = "";
    displayProfileImageDialog: boolean = false;
    onRowSelected: boolean = false;
    displaySMSPanel: boolean = false;
    filteredSMSList: Sms[] = [];
    sensSMSCapable: boolean = false;
    hmsgs: GrowlMessage[] = [];
    @ViewChild('dt') public dataTable: DataTable;
    filtered_users_json: any[] = [];
    workerLength: number = 0;
    basicData: BasicData;

    constructor(private _router: Router, 
        private _UsersService: UsersService, private confirmationService: ConfirmationService,
        public shared: SharedValues,
        private sharedFunctions: SharedFunctions,
        private excelService: ExcelService,
        private _fb: FormBuilder) {
        this.errorCntrler = new HandleErrorMsg(_router);
        this.init();
    }
    init() {

        let token: String = sessionStorage.getItem('token');
        this.uploadURL = environment.apiUrl + "/upload/img/" + token;
        this.selectedUserImagePath = "";
        this.roleList = [];
        this.roleList.push({ label: UserRoleEnum[1], value: 1 });
        this.roleList.push({ label: UserRoleEnum[2], value: 2 });
        this.roleList.push({ label: UserRoleEnum[3], value: 3 });
        this.roleList.push({ label: UserRoleEnum[4], value: 4 });
        this.roleList.push({ label: UserRoleEnum[5], value: 5 });
        this.roleList.push({ label: UserRoleEnum[6], value: 6 });

        this.filteredRegisterStateList = [];
        this.filteredRegisterStateList.push({ label: this.shared.allLabel, value: '' });
        this.filteredRegisterStateList.push({ label: this.shared.registerStatePhase1, value: this.shared.registerStatePhase1 });
        this.filteredRegisterStateList.push({ label: this.shared.registerStatePhase2, value: this.shared.registerStatePhase2 });
        this.filteredRegisterStateList.push({ label: this.shared.registerStatePhase3, value: this.shared.registerStatePhase3 });

        this.registerStateList = [];
        this.registerStateList.push({ label: this.shared.registerStatePhase1, value: 1 });
        this.registerStateList.push({ label: this.shared.registerStatePhase2, value: 2 });
        this.registerStateList.push({ label: this.shared.registerStatePhase3, value: 3 });


        this.yearList = this.sharedFunctions.initYearList();
        this.sensSMSCapable = false;
        let loggedInRole = Number(sessionStorage.getItem("roleId"));
        if (loggedInRole == UserRoleEnum.SysAdmin ||
            loggedInRole == UserRoleEnum.Operator_H ||
            loggedInRole == UserRoleEnum.Operator_M)
            this.sensSMSCapable = true;
        this.basicData = JSON.parse(localStorage.getItem('basicData'));

    }

    ngOnInit() {
        this.rePassword = this.user.password;
        var passwordRegularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$/;
        this.form = this._fb.group({
            userName: [this.user.userName, Validators.compose([Validators.required,
            Validators.pattern('^[A-Za-z0-9_-]{5,20}$')
            ]), CustomValidators.uniqueUserNameChecker(this._UsersService, this.newUser)],
            'passwords': this._fb.group({
                newPassword: ['', Validators.compose([Validators.required,
                Validators.pattern(passwordRegularExpression)])],
                confirmPassword: ['', Validators.required]
            }
                , { validator: CustomValidators.checkNewPassTheSame }),
            role: [this.user.userRole.id, Validators.required],
            firstName: [this.user.firstName],
            lastName: [this.user.lastName],
            nationalCode: [this.user.nationalCode, Validators.pattern('^[0-9]{10}$')],
            birthYear: [this.user.birthYear],
            sex: [this.user.sex],
            mobileNumber: [this.user.mobileNumber],
            email: [this.user.email, Validators.pattern(Constant.emailRegx)]
        });

        this.changePassForm = this._fb.group({
            'passwords': this._fb.group({
                newPassword: ['', Validators.compose([Validators.required,
                Validators.pattern(passwordRegularExpression)])]
            })
        });

        let loggedInUser: User = new User();
        this.uploadedFiles = [];
        this.rtvUserList();

    }
    exportExcel() {
        let filteredClientList: User[] = [];
        if (this.dataTable.filteredValue != undefined) {
            this.dataTable.filteredValue.forEach(user => {
                let entity = <User>user;
                filteredClientList.push(entity);
            });
        }
        else {
            this.workerUsers.forEach(usr => {
                let entity = <User>usr;
                filteredClientList.push(entity);
            });
        }

        this.excelService.exportAsExcelFile(filteredClientList, 'filteredWorkers');



    }
    rtvFilteredView4Excel(_id: number, element: User): ClientExcelView {
        try {
            let wxv: ClientExcelView = new ClientExcelView();
            wxv.firstName = element.firstName;
            wxv.lastName = element.lastName;
            wxv.mobileNumber = element.mobileNumber;
            wxv.appVersion = element.appVersion;

            return wxv;
        }
        catch (e) {
            console.log(e);
        }
    }
    rtvUserList() {
        this.loading = true;
        this._UsersService.getUsersList()
            .subscribe(response => {
                this.showUsersList = true;
                this.users = <User[]>response;
                this.systemUsers = [];
                this.workerUsers = [];
                this.users.forEach(element => {
                    let user: User = element;
                    if (user.userRole.id == UserRoleEnum.SysAdmin
                        || element.userRole.id == UserRoleEnum.Operator_H
                        || element.userRole.id == UserRoleEnum.Operator_M
                        || element.userRole.id == UserRoleEnum.Operator_L) {
                        this.systemUsers.push(user);
                    }
                    else if (user.userRole.id == UserRoleEnum.AppUserW && user.workerFlag)
                        this.workerUsers.push(user);

                });
                this.workerLength = this.workerUsers.length;

                this.loading = false;

            }
                , error => {
                    this.showErrorMsg = true;
                    this.showUsersList = false;
                    this.gMessage = [];
                    this.errorCntrler.gMessage = [];
                    let obj: User[] = error.error;
                    let err: BackendMessage = obj[0].error;
                    let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
                    let errorMessages = this.errorCntrler.gMessage;
                    this.loading = false;
                }
            );
    }



    onRowSelect(event: any) {
        this.newUser = false;
        this.user = this.cloneUser(event.data);
        this.displayDialog = true;
        this.dialogHeader = this.shared.editPanelLabel;
        this.innerPannelGMessage = [];
        this.errorCntrler.gMessage = [];
        this.selectedUserImagePath = this.baseImagePath + "/" + this.user.photo;
        this.form.clearValidators();
        this.form.markAsUntouched();
        this.form.controls['userName'].clearAsyncValidators();
        this.form.controls['userName'].clearValidators();
        this.onRowSelected = true;
    }
    edit(user: User) {
        this.user = this.cloneUser(user);
        this.editedUser = this.cloneUser(user);
        this.newUser = false;
        this.displayDialog = true;
        this.dialogHeader = this.shared.editPanelLabel;
        this.uploadedImageName = "";
        this.selectedUserImagePath = this.baseImagePath + "/" + user.photo;
        this.innerPannelGMessage = [];
        this.errorCntrler.gMessage = [];
        this.form.clearValidators();
        this.form.markAsUntouched();
        this.onRowSelected = false;
    }

    cloneUser(u: User): User {
        let user = new User();
        user.id = u.id;
        user.birthYear = u.birthYear;
        user.email = u.email;
        user.firstName = u.firstName;
        user.lastName = u.lastName;
        user.mobileNumber = u.mobileNumber;
        user.nationalCode = u.nationalCode;
        user.photo = u.photo;
        user.sex = u.sex;
        user.token = u.token;
        user.userName = u.userName;
        user.userRole = u.userRole;
        user.workerFlag = u.workerFlag;
        user.ownerFlag = u.ownerFlag;
        return user;
    }


    changePassword(user: User) {
        this.displayChangePassDialog = true;
        this.user = this.cloneUser(user);
        this.editedUser = this.cloneUser(user);
        this.rePassword = "";
        this.innerPannelGMessage = [];
        this.errorCntrler.gMessage = [];
        this.changePassForm.clearValidators();
        this.changePassForm.reset();
    }
    showViewDialog(user: any) {
        this.user = this.cloneUser(user);
        this.displayDetailViewDialog = true;
        this.selectedUserImagePath = this.baseImagePath + "/" + user.photo;

    }
    save(user: User) {
        try {
            this.user = user;
            this.loading = true;
            let susrs = [...this.systemUsers];
            let wusrs = [...this.workerUsers];
            this.user.userRole.name = UserRoleEnum[this.user.userRole.id];
            if (this.uploadedImageName != "")
                this.user.photo = this.uploadedImageName;
            if (this.newUser) {
                let encryptedPassword = Md5.hashStr(this.user.password);
                this.user.password = encryptedPassword.toString();
                this._UsersService.addUser(this.user)
                    .subscribe(response => {
                        this.user = <User>response;
                        if (user.userRole.id == UserRoleEnum.AppUserW && user.workerFlag) {
                            wusrs.push(this.user);
                            this.workerUsers = wusrs;
                        }
                        else if (user.userRole.id == UserRoleEnum.SysAdmin ||
                            user.userRole.id == UserRoleEnum.Operator_H ||
                            user.userRole.id == UserRoleEnum.Operator_M ||
                            user.userRole.id == UserRoleEnum.Operator_L) {
                            susrs.push(this.user);
                            this.systemUsers = susrs;
                        }




                        this.user = null;
                        this.displayDialog = false;
                        this.workerLength = this.workerUsers.length;

                        this.loading = false;
                    },
                        error => {
                            this.innerPannelGMessage = [];
                            this.errorCntrler.gMessage = [];
                            let obj: User = error.error;
                            let err: BackendMessage = obj.error;
                            let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
                            let errorMessages = this.errorCntrler.gMessage;
                            this.innerPannelGMessage = this.errorCntrler.gMessage;
                            this.loading = false;
                        });
            }
            else {
                this._UsersService.updateUser(this.user)
                    .subscribe(response => {
                        if (user.userRole.id == UserRoleEnum.AppUserW && user.workerFlag) {
                            if (this.onRowSelected)
                                wusrs[this.findSelectedUserIndexBetweenWorkers()] = this.user;
                            else
                                wusrs[this.findUserIndexBetweenWorkers(this.editedUser)] = this.user;
                            this.workerUsers = wusrs;
                            this.workerLength = this.workerUsers.length;

                        }
                        else if (user.userRole.id == UserRoleEnum.SysAdmin ||
                            user.userRole.id == UserRoleEnum.Operator_H ||
                            user.userRole.id == UserRoleEnum.Operator_M ||
                            user.userRole.id == UserRoleEnum.Operator_L) {
                            if (this.onRowSelected)
                                susrs[this.findSelectedUserIndexBetweenSystemUsers()] = this.user;
                            else {
                                susrs[this.findUserIndexBetweenSystemUsers(this.editedUser)] = this.user;
                            }
                            this.systemUsers = susrs;
                        }


                        this.displayDialog = false;
                        this.loading = false;
                        this.gMessage = [];
                        this.gMessage.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
                    },
                        error => {
                            this.loading = false;

                            this.innerPannelGMessage = [];
                            this.errorCntrler.gMessage = [];
                            let err: BackendMessage = <BackendMessage>(error.error);
                            let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
                            let errorMessages = this.errorCntrler.gMessage;
                            this.innerPannelGMessage = this.errorCntrler.gMessage;
                        });
            }
        }
        catch (e) {
            console.log(e);
        }

    }
    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {

                control.markAsTouched({ onlySelf: true });
                control.markAsDirty({ onlySelf: true });

            } else if (control instanceof FormGroup) {

                if (control['name'] != 'name')
                    this.validateAllFormFields(control);
            }
        });
    }
    submitChangePass() {
        try {
            if (!this.changePassForm.valid) {
                this.validateAllFormFields(this.changePassForm);
                return;
            }
            this.loading = true;
            let susrs = [...this.systemUsers];
            let wusrs = [...this.workerUsers];

            let encryptedPassword = Md5.hashStr(this.user.password);
            this.user.password = encryptedPassword.toString();

            this._UsersService.updatePass(this.user)
                .subscribe(response => {
                    if (this.user.userRole.id == UserRoleEnum.AppUserW && this.user.workerFlag) {
                        wusrs[this.findUserIndexBetweenWorkers(this.editedUser)] = this.user;
                        this.workerUsers = wusrs;
                    }
                    else if (this.user.userRole.id == UserRoleEnum.SysAdmin ||
                        this.user.userRole.id == UserRoleEnum.Operator_H ||
                        this.user.userRole.id == UserRoleEnum.Operator_M ||
                        this.user.userRole.id == UserRoleEnum.Operator_L) {
                        susrs[this.findUserIndexBetweenSystemUsers(this.editedUser)] = this.user;
                        this.systemUsers = susrs;
                    }


                    this.gMessage = [];
                    this.gMessage.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
                    this.displayChangePassDialog = false;
                    this.loading = false;
                },
                    error => {
                        this.loading = false;
                        this.innerPannelGMessage = [];
                        this.errorCntrler.gMessage = [];
                        let err: BackendMessage = <BackendMessage>(error.error);
                        let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
                        let errorMessages = this.errorCntrler.gMessage;
                        this.innerPannelGMessage = this.errorCntrler.gMessage;
                    });
        }
        catch (e) {
            console.log(e);
        }
    }
    delete(user: User) {
        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                this.loading = true;
                this.user = user;
                this._UsersService.deleteSystemUser(user)
                    .subscribe(response => {
                        this.loading = false;
                        if (this.user.userRole.id == UserRoleEnum.AppUserW && this.user.workerFlag) {
                            let index = this.findUserIndexBetweenWorkers(user);
                            this.workerUsers = this.workerUsers.filter((val, i) => i != index);
                        }
                        else if (this.user.userRole.id == UserRoleEnum.SysAdmin ||
                            this.user.userRole.id == UserRoleEnum.Operator_H ||
                            this.user.userRole.id == UserRoleEnum.Operator_M ||
                            this.user.userRole.id == UserRoleEnum.Operator_L) {
                            let index = this.findUserIndexBetweenSystemUsers(user);
                            this.systemUsers = this.systemUsers.filter((val, i) => i != index);
                        }

                        this.workerLength = this.workerUsers.length;

                        this.gMessage = [];
                        this.gMessage.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
                        this.displayDialog = false;
                    },
                        error => {
                            this.loading = false;

                            this.innerPannelGMessage = [];
                            this.errorCntrler.gMessage = [];
                            console.log(error.error);
                            let err: BackendMessage = <BackendMessage>(error.error);
                            let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
                            let errorMessages = this.errorCntrler.gMessage;
                            this.innerPannelGMessage = this.errorCntrler.gMessage;
                        });
            }
        });

    }

    onUpload(event: any) {
        console.log(event);
        let responseMsg: BackendMessage = JSON.parse(event.xhr.responseText);
        this.uploadedImageName = responseMsg.msg[0].msg;
        this.selectedUserImagePath = this.baseImagePath + "/" + this.uploadedImageName;
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }

    }
    onBeforeUpload(event:any){
        console.log(event);
    }
    showProfileImage() {
        this.displayProfileImageDialog = true;
    }
    deleteProfileImage() {
        this.selectedUserImagePath = "";
        this.user.photo = "";
    }
    findUserIndexBetweenWorkers(u: User): number {
        for (let i = 0; i < this.workerUsers.length; i++) {
            if (u.id == this.workerUsers[i].id)
                return i;
        }
        return -1;
    }
    findUserIndexBetweenSystemUsers(u: User): number {
        for (let i = 0; i < this.systemUsers.length; i++) {
            if (u.id == this.systemUsers[i].id)
                return i;
        }
        return -1;
    }

    findSelectedUserIndexBetweenWorkers(): number {
        return this.workerUsers.indexOf(this.selectedUser);
    }
    findSelectedUserIndexBetweenSystemUsers(): number {
        return this.systemUsers.indexOf(this.selectedUser);
    }
    showSMSPanel() {
        if (!this.sensSMSCapable)
            this.hmsgs.push({ severity: 'error', summary: '', detail: this.shared.restrictedAccess });
        this.filteredSMSList = [];
        if (this.dataTable.filteredValue != undefined) {
            this.dataTable.filteredValue.forEach(worker => {
                let sms: Sms = new Sms();
                sms.mobileNumber = worker.mobileNumber;
                this.filteredSMSList.push(sms);
            });
        }
        else {
            this.workerUsers.forEach(client => {
                let sms: Sms = new Sms();
                sms.mobileNumber = client.mobileNumber;
                this.filteredSMSList.push(sms);
            });
        }
        this.displaySMSPanel = true;

    }
    onFilter(e) {
        let list = e.filteredValue;
        this.workerLength = list.length;
    }
}