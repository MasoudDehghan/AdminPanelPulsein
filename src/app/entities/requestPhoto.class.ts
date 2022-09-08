import {User} from './user.class'

export class RequestPhoto{
    id:number;
    info:string;
    photo:string;
    verified:boolean;
    verifyBy:User;
    verifyTime:string;
}