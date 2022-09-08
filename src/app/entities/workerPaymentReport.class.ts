import { TransactionV } from "./transactionV.class";

export class WorkerPaymentReport{
    id:number;
    code:string;
    firstName:string;
    lastName:string;
    lastPaymentTime:string;
    payableAmount:number;
    transactions:TransactionV[];
    lastRemain:number;
	sumReqPriceCash:number;
	sumReqPriceCredit:number;
	sumBonous:number;
	sumCommission:number;
	currentCredit:number;
	afterPaymentCredit:number;

}