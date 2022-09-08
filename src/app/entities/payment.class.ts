import {PaymentMethod} from './paymentMethod.class'
import {BalanceSheet} from './balanceSheet.class'
import { BackendMessage } from './Msg.class';

export class Payment{
    id:number;
	price:number;
	timeS:string;
	trackingCode:string;
	balanceSheet:BalanceSheet;
	paymentMethod:PaymentMethod;
	error:BackendMessage;

}