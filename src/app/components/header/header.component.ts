import { GrowlMessage } from 'app/entities/growlMessage.class';
import { UserRoleEnum } from './../../enums/userRole.enum';
import { TempUserSmsDto } from './../../pEntites/tempUserSmsDto.class';
import { AdminService } from './../../services/admin.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, Message } from 'primeng/primeng';
import { timer } from 'rxjs';
import "rxjs/add/operator/takeWhile";
import { Md5 } from 'ts-md5/dist/md5';
import { environment } from '../../../environments/environment';
import { BackendMessage } from '../../entities/Msg.class';
import { Statistics } from '../../entities/statistics.class';
import { User } from '../../entities/user.class';
import { AuthService } from '../../services/auth.service';
import { HomePageService } from '../../services/homePage.service';
import { LoginCheck } from '../../services/loginCheck.service';
import { SharedValues } from '../../services/shared-values.service';
import { UsersService } from '../../services/users.service';
import { CustomValidators } from '../../shared/custome-validators.class';
import { HandleErrorMsg } from '../../shared/handleError.class';

@Component({
    moduleId: module.id,
    selector: 'headerComponent',
    templateUrl: './header.template.html',
    styleUrls: ['headerStyle.css'],
    providers: [LoginCheck, HomePageService, UsersService,AdminService]
})

export class HeaderComponent {
    title = this.shared.projectTitle;
    oldPWDLabelFa = this.shared.oldPWDLabelFa;
    newPWDLabelFa = this.shared.newPWDLabelFa;
    rePWDLabelFa = this.shared.rePWDLabelFa;
    saveLabel = this.shared.saveLabel;
    passValidMsg: string = this.shared.passValidMsg;
    passwordInvalidMsg = this.shared.passwordInvalidMsg;
    oldPasswordInvalid = this.shared.oldPasswordInvalid;
    loginCode = this.shared.loginCode;
    passNotTheSame = this.shared.passNotTheSame;
    numberOfUnreadMessage = 0;
    loggedInProfileImagePath = "../../../assets/images/sampleProfilePic.png";
    errorCntrler: HandleErrorMsg;
    showChangePassPanelLabel = this.shared.ChangePassPanelLabel;
    sendLabel = this.shared.sendLabel;
    showChangePassword = false;
    showErrorMsgInPanel: boolean = false;
    errorMsgInPanel: string[] = [];
    form: FormGroup;
    tempCodeForm: FormGroup;
    baseImagePath: string = environment.fileServerUrl;
    loading: boolean = false;
    currentUser: User;
    items: MenuItem[];

    stat: Statistics = new Statistics();
    newMsgCounter: number = 0;
    currentReqCounter: number = 0;
    interval: number
    alive: boolean;
    displayTempCodePanel = false;
    showResultCode = false;
    mobileNumber: string;
    userRole: number = 0;
    resultCode:string;
    permFlag = false;
    innerPannelGMessage: Message[] = [];
    constructor(private _router: Router, 
        private _LoginCheck: LoginCheck,
        private _UsersService: UsersService,
        private _statService: HomePageService,
        private _adminService: AdminService,
        public shared: SharedValues,
        private _fb: FormBuilder) {
        this.errorCntrler = new HandleErrorMsg(_router);

    }
    ngOnInit() {
        try {
            this.interval = 60000;
            this.alive = true;

            this.currentUser = new User();
            this.currentUser.id = Number(sessionStorage.getItem('userID'));
            this.currentUser.userName = sessionStorage.getItem('userName');
            this.currentUser.userRole.id = Number(sessionStorage.getItem('roleId'));
            this.currentUser.photo = sessionStorage.getItem('profilePicture');

            let loggedInRole = Number(sessionStorage.getItem("roleId"));
            this.permFlag = false;

            if (loggedInRole == UserRoleEnum.SysAdmin ||
                 loggedInRole == UserRoleEnum.Operator_H || loggedInRole == UserRoleEnum.Operator_M
                 || loggedInRole == UserRoleEnum.Operator_L) {
              this.permFlag = true;
            }
            this.form = this._fb.group({
                oldPassword: ['', Validators.required],
                'passwords': this._fb.group({
                    newPassword: ['', Validators.compose([Validators.required,
                    Validators.pattern('((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,30})')])],
                    confirmPassword: ['', Validators.required]
                }
                    , { validator: CustomValidators.checkNewPassTheSame })
            });

            this.tempCodeForm = this._fb.group({
                mobileNumber: ['', Validators.required],
                role: [0, Validators.required]
            });
            this.items = [
                {
                    label: this.currentUser.userName, icon: 'fa-info'
                }
                ,
                {
                    label: this.shared.ChangePassPanelLabel, icon: 'fa-key', command: (click) => {
                        this.showChangePassword = !this.showChangePassword;
                    }
                },
                {
                    label: this.shared.menuItem8Label, icon: 'fa-sign-out',
                    command: (click) => {
                        this._LoginCheck.sendLogoutRequest()
                            .subscribe(response => {
                                let result: User = <User>response;
                                this._router.navigate(['/login']);
                            }
                                , error => {
                                    this._router.navigate(['/login']);

                                }
                            );

                        sessionStorage.clear();
                        this._router.navigate(['/login']);

                    }
                }
            ];
            timer(0, this.interval)
                .takeWhile(() => this.alive)
                .subscribe(() => {
                    this.refreshData();
                });
        }
        catch (e) {
            console.log(e);
        }


    }
    redirectToHome() {
        this._router.navigate(['/home']);
    }
    refreshData() {

        this._statService.geHeaderStats().subscribe(result => {
            this.stat = <Statistics>result;
            this.newMsgCounter = this.stat.cartableCnt;
            this.currentReqCounter = this.stat.reqTotalOnProgress;
        }, error => {
            let obj: Statistics = error.error;
            let err: BackendMessage = obj.error;
            let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
            let errorMessages = this.errorCntrler.gMessage;
            console.log(errorMessages);
        });
    }
    ngOnDestroy(): void {
        this.alive = false; // switches your TimerObservable off
    }

    changePass(user: User) {
        this.loading = true;
        let encryptedPassword = Md5.hashStr(user.password);
        user.password = encryptedPassword.toString();
        this._UsersService.changeSystemUserPass(user).subscribe(response => {
            this.showErrorMsgInPanel = false;
            this.loading = false;
        }, error => {
            this.showErrorMsgInPanel = true;
            this.loading = false;
            let err: BackendMessage = this.errorCntrler.handleError(error);
            err.msg.forEach(element => {
                this.errorMsgInPanel.push(element.msg);
            });
        });
    }
    showTempCodePanel() {
        this.displayTempCodePanel = true;
        this.showResultCode = false;
    }
    generateTempCode() {
        this.showResultCode = false;
        this.errorMsgInPanel = [];
        let req = new TempUserSmsDto();
        req.mobileNumber = this.mobileNumber;
        req.workerFlag = false;
        if (this.userRole == 1)
            req.workerFlag = true;
        this._adminService.tempSms(req).subscribe(response => {
            this.showErrorMsgInPanel = false;
            this.loading = false;
            this.showResultCode = true;
            let code = <TempUserSmsDto>response;
            this.resultCode = code.smsCode;
        }, error => {
            console.log(error);
            this.showErrorMsgInPanel = true;
            this.loading = false;
            let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, error.error.error);
            let errorMessages = this.errorCntrler.gMessage;
            this.innerPannelGMessage = this.errorCntrler.iMessage;
            console.log(this.innerPannelGMessage);
        });
    }
}