import { RequestP } from './requestP.class';
import { UserP } from './userP.class';
import { BackendMessage } from "../entities/Msg.class";

export class TransactionP{
    id:number;
    error:BackendMessage;	
    amount:number;
	balance:number;
	registerTime:string;
	depositTime:string;
	inc:boolean;
	cash:boolean;
	trackingCode:string;
	referenceUser:UserP;
	user:UserP;
	transactionType:string;
	request:RequestP;
	transactionTypeId:number;
	discountId:number;
	discountCode:string;
}