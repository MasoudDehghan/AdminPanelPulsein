import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
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

@Component({
    moduleId: module.id,
    selector: 'clientUsersComponent',
    templateUrl: './client-users.template.html',
    providers: [UsersService, ExcelService],
    styleUrls: ['../../../assets/css/dashboard.css']
})

export class ClientUsersMgmComponent implements OnInit {
    activeLabel: string = this.shared.appClientUsersLabel;
    errorCntrler: HandleErrorMsg;
    gMessage: GrowlMessage[] = [];
    innerPannelGMessage: GrowlMessage[] = [];
    clientUsers: User[] = [];
    @ViewChild('dt') public dataTable: DataTable;

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
    versionList: SelectItem[] = [];
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
    displayNotificationPanel: boolean = false;
    filteredSMSList: Sms[] = [];
    userIDList: number[] = [];
    sensSMSCapable: boolean = false;
    hmsgs: GrowlMessage[] = [];
    clientLength: number = 0;
    filtered_users_json: any[] = [];
    basicData: BasicData;

    constructor(private _router: Router, 
        private _UsersService: UsersService, private confirmationService: ConfirmationService,
        public shared: SharedValues,
        private excelService: ExcelService,
        private sharedFunctions: SharedFunctions,
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

    rtvUserList() {
        this.loading = true;
        this.clientUsers = [];
        this._UsersService.getClientUsers()
            .subscribe(response => {
                console.log(response);    
                this.showUsersList = true;
                let clientUsers = <User[]>response;
                clientUsers.forEach(client=>{
                    client.version = this.rtVersion(client);
                    this.clientUsers.push(client);
                });
                this.clientUsers = clientUsers;                
                this.clientLength = this.clientUsers.length;
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

    rtVersion(client:User){
        if(client.webEnable)
            return 'Web';
        else if(client.iosEnable)
            return client.appVersionIos;
        else if(client.androidEnable)
            return client.appVersion;
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
            let cusrs = [...this.clientUsers];
            this.user.userRole.name = UserRoleEnum[this.user.userRole.id];
            if (this.uploadedImageName != "")
                this.user.photo = this.uploadedImageName;

            this._UsersService.updateUser(this.user)
                .subscribe(response => {

                    if (this.onRowSelected)
                        cusrs[this.findSelectedUserIndexBetweenClientUsers()] = this.user;
                    else {
                        cusrs[this.findUserIndexBetweenClientUsers(this.editedUser)] = this.user;
                    }
                    this.clientUsers = cusrs;
                    this.clientLength = cusrs.length;

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

        catch (e) {
            console.log(e);
        }

    }
    submitChangePass() {
        try {
            if (!this.changePassForm.valid) {
                this.validateAllFormFields(this.changePassForm);
                return;
            }
            this.loading = true;
            let cusrs = [...this.clientUsers];

            let encryptedPassword = Md5.hashStr(this.user.password);
            this.user.password = encryptedPassword.toString();

            this._UsersService.updatePass(this.user)
                .subscribe(response => {

                    cusrs[this.findUserIndexBetweenClientUsers(this.editedUser)] = this.user;
                    this.clientUsers = cusrs;

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
    exportExcel() {
        let filteredClientList: User[] = [];
        if (this.dataTable.filteredValue != undefined) {
            this.dataTable.filteredValue.forEach(user => {
                let entity = <User>user;
                filteredClientList.push(entity);
            });
        }
        else {
            this.clientUsers.forEach(usr => {
                let entity = <User>usr;
                filteredClientList.push(entity);
            });
        }

        this.excelService.exportAsExcelFile(filteredClientList, 'filteredClients');
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
    delete(user: User) {
        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                this.loading = true;
                this.user = user;
                this._UsersService.deleteSystemUser(user)
                    .subscribe(response => {
                        this.loading = false;

                        let index = this.findUserIndexBetweenClientUsers(user);
                        this.clientUsers = this.clientUsers.filter((val, i) => i != index);

                        this.gMessage = [];
                        this.gMessage.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
                        this.displayDialog = false;
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
        });

    }

    onUpload(event: any) {
        let responseMsg: BackendMessage = JSON.parse(event.xhr.responseText);
        this.uploadedImageName = responseMsg.msg[0].msg;
        this.selectedUserImagePath = this.baseImagePath + "/" + this.uploadedImageName;
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }

    }
    showSMSPanel() {
        if (!this.sensSMSCapable)
            this.hmsgs.push({ severity: 'error', summary: '', detail: this.shared.restrictedAccess });
        this.filteredSMSList = [];
        if (this.dataTable.filteredValue != undefined) {
            this.dataTable.filteredValue.forEach(client => {
                let sms: Sms = new Sms();
                sms.mobileNumber = client.mobileNumber;
                this.filteredSMSList.push(sms);
            });
        }
        else {
            this.clientUsers.forEach(client => {
                let sms: Sms = new Sms();
                sms.mobileNumber = client.mobileNumber;
                this.filteredSMSList.push(sms);
            });
        }

        this.clientLength = this.filteredSMSList.length;

        this.displaySMSPanel = true;
    }
    showNotificationPanel() {
        if (!this.sensSMSCapable)
            this.hmsgs.push({ severity: 'error', summary: '', detail: this.shared.restrictedAccess });
        this.userIDList = [];

        if (this.dataTable.filteredValue != undefined) {
            this.dataTable.filteredValue.forEach(client => {
                this.userIDList.push(client.id);
            });
        }
        else {
            this.clientUsers.forEach(client => {
                this.userIDList.push(client.id);
            });
        }

        this.clientLength = this.userIDList.length;

        this.displayNotificationPanel = true;
    }
    showProfileImage() {
        this.displayProfileImageDialog = true;
    }
    deleteProfileImage() {
        this.selectedUserImagePath = "";
        this.user.photo = "";
    }

    findUserIndexBetweenClientUsers(u: User): number {
        for (let i = 0; i < this.clientUsers.length; i++) {
            if (u.id == this.clientUsers[i].id)
                return i;
        }
        return -1;
    }

    findSelectedUserIndexBetweenClientUsers(): number {
        return this.clientUsers.indexOf(this.selectedUser);
    }
    onFilter(e) {
        let list = e.filteredValue;
        this.clientLength = list.length;
    }
    onCloseNotificationPanel(){
        this.displayNotificationPanel = false;
        this.gMessage = [];
        this.gMessage.push({ severity: 'info', summary: '', detail: this.shared.notificationSentMsg });
    }

}