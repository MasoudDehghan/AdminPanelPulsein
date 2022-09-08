import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LoginCheck } from '../services/loginCheck.service'
import { BackendRequestClass } from './../services/backend.request';
import { SharedValues } from '../services/shared-values.service'
import { User } from '../entities/User.class'
import { UserRoleEnum } from '../enums/userRole.enum'
import { Md5 } from 'ts-md5/dist/md5';
import { environment } from 'environments/environment';

@Component({
    moduleId: module.id,
    selector: 'login',
    templateUrl: './login.template.html',
    providers: [LoginCheck,BackendRequestClass],
    styleUrls: ['../../assets/css/loginStyle.css']

})
export class LoginComponent {
    form: FormGroup;
    showErrorMsg: boolean = false;
    errorMsg: string = "";
    projectTitle = this.shared.projectTitle;
    version = environment.version;
    userNameLabel: string = this.shared.userNameLabel;
    passwordLabel: string = this.shared.passwordLabelFa;
    userNameValidMsg: string = this.shared.userNameValidMsg;
    passValidMsg: string = this.shared.passValidMsg;
    loginBtnLabel = this.shared.loginBtnLabel;
    loginHeader = this.shared.loginHeader;

    isLoading: boolean = false;

    constructor(private _fb: FormBuilder, private _LoginCheck: LoginCheck,
        public backendRequestClass:BackendRequestClass,public shared: SharedValues,
        private _router: Router, private _activatedRouter: ActivatedRoute, location: Location) {

    }
    ngOnInit() {
        this.form = this._fb.group({
            userName: ['', Validators.required],
            password: ['', Validators.required]
        });
    }


    onSubmit(value: User) {
        let user:User = value;
        if(user.userName == '' || user.password == ''){
            this.errorMsg = this.shared.invalidLoginMsg;
            this.showErrorMsg = true;
            return;
        }

        let encryptedPassword = Md5.hashStr(value.password);
        user.password = encryptedPassword.toString();
        //console.log(user.password);
        this.isLoading = true;
        //ok:200,badRequest:400,sessionExpired:408,unauthorized:401
        this._LoginCheck.sendLoginRequest(user)
            .subscribe(response => {
                let result: User = <User>response;
                this.isLoading = false;
                let userRoleID:number = result.userRole.id;
                if (userRoleID == UserRoleEnum.SysAdmin ||
                    userRoleID == UserRoleEnum.Operator_H ||
                    userRoleID == UserRoleEnum.Operator_M ||
                    userRoleID == UserRoleEnum.Operator_L ||
                    userRoleID == UserRoleEnum.Accountant) {
                    sessionStorage.setItem('authenticated', "yes");
                    sessionStorage.setItem('userID', result.id.toString());
                    sessionStorage.setItem('userName', result.userName);
                    sessionStorage.setItem('roleId', String(result.userRole.id));
                    sessionStorage.setItem('profilePicture',result.photo);
                    sessionStorage.setItem('token', result.token.toString());
                    this.backendRequestClass.initData(userRoleID);                            
                    
                    if(userRoleID != UserRoleEnum.Accountant)
                        this._router.navigateByUrl('/home');
                    else 
                        this._router.navigateByUrl('/WFinancialMgmComponent');
                    this.showErrorMsg = false;
                }
                else {
                    this.showErrorMsg = true;
                    sessionStorage.setItem('authenticated', "no");
                    this.errorMsg = this.shared.invalidLoginRole;
                }

            }
            , error => {
                this.isLoading = false;
                this.showErrorMsg = true;
                sessionStorage.setItem('authenticated', "no");
                if (error.status == 500) {                  
                    //  let errResult: User =  <User>(error.error);                   
                    // console.log(errResult);
                    this.errorMsg = this.shared.invalidLoginMsg;
                }
                else if (error.status == 400) {
                    this.errorMsg = this.shared.badRequestMsg;
                }
                else {
                    this.errorMsg = this.shared.unableToConnectBackEnd;
                }


            }
            );

    }

} 
