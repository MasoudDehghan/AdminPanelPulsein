import {Worker} from './worker.class'
import {UserRole} from './UserRole.class'
import { BackendMessage } from '../entities/Msg.class'
export class User{
    id:number;
    userName:string;
    password:string;
    credit:number;        
    userRole:UserRole = new UserRole();
    birthYear:string;
    email:string;
    firstName:string;
    lastName:string;
    sex:number;
    mobileNumber:string;
    nationalCode:string;
    photo:string;
    token:string;
    ownerFlag:boolean;
    workerFlag:boolean;
    deleted:boolean;
    deviceId:string;
    verified:number;
    verificationTimeS:string;
    verifyBy:User;
    worker:Worker;
    registerTimeS:string;
    appVersion:string;
    appVersionIos:string;
    reqCntSuc:number;
    reqCntFail:number;
    error:BackendMessage;

    webEnable:boolean;
    iosEnable:boolean;
    androidEnable:boolean;
    version:string;
    get fullName(){
        return this.firstName + " "+this.lastName;
    }
 
}