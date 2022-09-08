import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WorkStation } from 'app/entities/workStation.class';
import { ConfirmationService, SelectItem } from 'primeng/primeng';
import { GrowlMessage } from '../../entities/growlMessage.class';
import { JobCategory3 } from '../../entities/JobCategory3.class';
import { BackendMessage } from '../../entities/Msg.class';
import { User } from '../../entities/user.class';
import { Worker } from '../../entities/worker.class';
import { WorkerToJobsMap } from '../../entities/workerToJobsMap.class';
import { WorkType } from '../../entities/WorkType.class';
import { UserRoleEnum } from '../../enums/userRole.enum';
import { JobCateogryService } from '../../services/jobCategory.service';
import { SharedValues } from '../../services/shared-values.service';
import { UsersService } from '../../services/users.service';
import { CustomValidators } from '../../shared/custome-validators.class';
import { HandleErrorMsg } from '../../shared/handleError.class';
import { WorkerStationMgmService } from './../../services/workerStationMgm.service';
import { WorkTypeService } from './../../services/workTypes.service';

@Component({
    moduleId: module.id,
    selector: 'unregisteredWorkerMgmComponent',
    templateUrl: './unregisteredWorkerMgm.template.html',
    providers: [UsersService, WorkTypeService, JobCateogryService,WorkerStationMgmService],
    styleUrls: ['../../../assets/css/dashboard.css']
})

export class UnregisteredWorkerMgmComponent implements OnInit {
    activeLabel: string = this.shared.tempUsers;
    errorCntrler: HandleErrorMsg;
    gMessage: GrowlMessage[] = [];
    innerPannelGMessage: GrowlMessage[] = [];
    pendingUsers: User[] = [];
    selectedUser: User;

    displayDialog: boolean;

    showErrorMsg: boolean = false;
    errorMsg: string[] = [];

    showErrorMsgInPanel: boolean = false;
    errorMsgInPanel: string[] = [];
    form: FormGroup;
    showUsersList: boolean = false;
    loading: boolean = false;
    totalCntr:number = 0;
    dialogHeader: string;


    selectedWorkStation: WorkStation = new WorkStation();
    workTypeList: SelectItem[] = [];
    selectedWorkType:WorkType;
    selectedWorkStationTitle:string;
    jobCategory3List: SelectItem[] = [];
    jobCategory3Map: Map<number, JobCategory3> = new Map<number, JobCategory3>();
    selectedJobCategory3: JobCategory3 = null;
    workerToJobMapList: WorkerToJobsMap[] = [];
    constructor(private _router: Router, 
        private _UsersService: UsersService,
        private _WorkTypeService: WorkTypeService,
        private _JobCateogryService: JobCateogryService,
        private _WorkerStationMgmService:WorkerStationMgmService,
        private confirmationService: ConfirmationService,
        public shared: SharedValues,
        private _fb: FormBuilder) {
        this.errorCntrler = new HandleErrorMsg(_router);
        this.init();
    }
    init() {

        let token: String = sessionStorage.getItem('token');
        this.dialogHeader = this.shared.tempUsers;
        this.initWorkerTypeList();
        this.initJobCategory3List();

    }
    initWorkerTypeList(){
        this._WorkTypeService.getWorkTypesList().subscribe(response => {
            let _workTypeList: WorkType[] = <WorkType[]>response;
            _workTypeList.forEach(element => {
                this.workTypeList.push({ label: element.name, value: element });
            });
            this.selectedWorkType = this.workTypeList[0].value;
        }, error => {
            this.showErrorMsg = true;
            this.gMessage = [];
            this.errorCntrler.gMessage = [];
            let obj: WorkType[] = error.error;
            let err: BackendMessage = obj[0].error;
            let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
            let errorMessages = this.errorCntrler.gMessage;
            this.loading = false;
        });
    }
    initJobCategory3List() {
        this.jobCategory3List = [];
        this.jobCategory3Map.clear();
        this.jobCategory3List.push({ label: this.shared.chooseJC3Msg, value: null });


        this._JobCateogryService.getAllJobCategory3List()
            .subscribe(response => {
                let list: JobCategory3[] = <JobCategory3[]>response;
                list.forEach(element => {
                    this.jobCategory3Map.set(element.id, element);
                    this.jobCategory3List.push({ label: element.name, value: element });
                });
            }
                , error => {
                    this.showErrorMsg = true;
                    this.gMessage = [];
                    this.errorCntrler.gMessage = [];
                    let obj: JobCategory3[] = error.error;
                    let err: BackendMessage = obj[0].error;
                    let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
                    let errorMessages = this.errorCntrler.gMessage;
                    this.loading = false;
                }
            );

    }
    ngOnInit() {

        this.form = this._fb.group({
            title:['',Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
                        CustomValidators.uniqueWorkStationTitleChecker(this._WorkerStationMgmService)],
            workStationType: [],
            jobCategory3FormCntrl: [],

        });



        let loggedInUser: User = new User();
        this.rtvUserList();

    }

    rtvUserList() {
        this.loading = true;
        this.totalCntr = 0;
        this._UsersService.getUsersList()
            .subscribe(response => {
                this.showUsersList = true;
                let users:User[] = <User[]>response;
             
                this.pendingUsers = [];
                users.forEach(element => {
                    let user: User = element;
                    if (user.userRole.id == UserRoleEnum.AppUserW && !user.workerFlag)
                        this.pendingUsers.push(user);
                });
                this.totalCntr  = this.pendingUsers.length;
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
    edit(user: User) {
        this.selectedUser = this.cloneUser(user);
        this.displayDialog = true;
        this.dialogHeader = this.shared.editPanelLabel;
        this.innerPannelGMessage = [];
        this.errorCntrler.gMessage = [];
        this.form.clearValidators();
        this.form.markAsUntouched();
        this.selectedWorkStation = new WorkStation();
        this.workerToJobMapList = [];
        this.selectedWorkType = this.workTypeList[0].value;
        this.selectedWorkStationTitle = "";
        }

    save(selectedWorkStation: WorkStation) {
        try {
            this.gMessage = [];
            if(this.selectedWorkStationTitle == '')
            {
                this.gMessage.push({ severity: 'error', summary: this.shared.errorLabel, detail: this.shared.InnerCode_InvalidTitleMsg });
                throw new Error(this.shared.InnerCode_InvalidTitleMsg);
            }
            if (this.workerToJobMapList.length == 0) {
                this.gMessage.push({ severity: 'error', summary: this.shared.errorLabel, detail: this.shared.InnerCode_EmptyJobsListMsg });
                throw new Error(this.shared.InnerCode_EmptyJobsListMsg);
            }


            if(!this.form.valid){
                this.validateAllFormFields(this.form);
                return;
              }


           
            this.selectedWorkStation = selectedWorkStation;
            this.selectedWorkStation.owner = new User();
            this.selectedWorkStation.owner.id = this.selectedUser.id;
            this.selectedWorkStation.workers[0] = new Worker();
            this.selectedWorkStation.workers[0].workerToJobsMaps = this.workerToJobMapList;
            this.selectedWorkStation.workType = this.selectedWorkType;
            this.selectedWorkStation.title = this.selectedWorkStationTitle;
            //
            console.log(this.selectedWorkStation);
            let pusrs = [...this.pendingUsers];
            this.loading = true;
            this._WorkerStationMgmService.initialAddFromPortal(this.selectedWorkStation).subscribe(response=>{
                let out:WorkStation = <WorkStation>response;
                let index = this.findUserIndexBetweenPendingUsers(out.owner);
                this.pendingUsers = this.pendingUsers.filter((val, i) => i != index);
                this.gMessage.push({ severity: 'info', summary: this.shared.successFullChangeMsg, detail: this.shared.successFullChangeMsg });
                this.displayDialog = false;
                this.loading = false;
            },error=>{
                this.showErrorMsg = true;
                this.showUsersList = false;
                this.gMessage = [];
                this.errorCntrler.gMessage = [];
                let obj: WorkStation = error.error;
                let err: BackendMessage = obj.error;
                let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
                let errorMessages = this.errorCntrler.gMessage;
                this.loading = false;
            });




        }
        catch (e) {
            console.log(e);
        }

    }
    addWorkerJobMap() {
        try {
            let _workerToJobMapList = [...this.workerToJobMapList];
            let wj: WorkerToJobsMap = new WorkerToJobsMap();
            wj.jobCategory3 = this.selectedJobCategory3;
            if(this.selectedJobCategory3 == null)
                return;
            if (this.searchWorkerJobMapInList(wj)) {
                this.gMessage.push({ severity: 'warn', summary: this.shared.warningLabel, detail: this.shared.repeatedWorkerJobMsg });
                return;
            }

            _workerToJobMapList.push(wj);
            this.workerToJobMapList = _workerToJobMapList;
        }
        catch (e) {
            console.log(e.status);
        }
    }
    removeWorkerJobMap(wj: WorkerToJobsMap) {
        let selectedWorkerJobMap = this.workerToJobMapList.find(x => x == wj);
        let index = this.workerToJobMapList.indexOf(selectedWorkerJobMap, 0);
        this.workerToJobMapList = this.workerToJobMapList.filter((val, i) => i != index);
    }
    searchWorkerJobMapInList(wj: WorkerToJobsMap): boolean {
        let out = false;
        try {
            this.workerToJobMapList.forEach(element => {
                        if (Number(element.jobCategory3.id) == Number(wj.jobCategory3.id))
                            out = true;
                
            });
            return out;
        }
        catch (e) {
            return false;
        }
    }
    delete(user: User) {
        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                this.loading = true;
                this.selectedUser = user;
                this._UsersService.deleteSystemUser(user)
                    .subscribe(response => {
                        this.loading = false;
                        if (this.selectedUser.userRole.id == UserRoleEnum.AppUserW && !this.selectedUser.workerFlag) {
                            let index = this.findUserIndexBetweenPendingUsers(user);
                            this.pendingUsers = this.pendingUsers.filter((val, i) => i != index);
                        }

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

    validateAllFormFields(formGroup: FormGroup) {         
        Object.keys(formGroup.controls).forEach(field => { 
          const control = formGroup.get(field);             
          if (control instanceof FormControl) {            
            control.markAsTouched({ onlySelf: true });
            control.markAsDirty({ onlySelf: true });
          } else if (control instanceof FormGroup) {        
            this.validateAllFormFields(control);            
          }
        });
      }  

    findUserIndexBetweenPendingUsers(u: User): number {
        for (let i = 0; i < this.pendingUsers.length; i++) {
            if (u.id == this.pendingUsers[i].id)
                return i;
        }
        return -1;
    }

    findSelectedUserIndexBetweenPendingUsers(): number {
        return this.pendingUsers.indexOf(this.selectedUser);
    }


}