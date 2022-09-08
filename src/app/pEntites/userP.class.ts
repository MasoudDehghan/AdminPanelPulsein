import { BackendMessage } from './../entities/Msg.class';
import { UserExtraP } from './userExtraP.class';
import { UserFinancialP } from './userFinancialP.class';
export class UserP{
    id:number;
	error:BackendMessage;	
	firstName:string;
	lastName:string;
	mobileNumber:string;
	extra:UserExtraP;
	financialInfo:UserFinancialP;
	reqCntSuc:number;
	reqCntFail:number;
}