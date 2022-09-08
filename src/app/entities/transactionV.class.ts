import { UserV } from "./userV.class";
import { RequestV } from "./requestV.class";

export class TransactionV{
    id:number;
    amount:number;
	balance:number;
    registerTime:string;
    depositTime:string;
	inc:boolean;
    cash:boolean;
    trackingCode:string;
    request:RequestV;
    user:UserV;
    transactionTypeId:number;
    transactionType:string;
    referenceUser:UserV;
}