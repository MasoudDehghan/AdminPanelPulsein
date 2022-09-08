import {WorkStation} from './workStation.class'
import { BackendMessage } from '../entities/Msg.class'
import { Payment } from '../entities/payment.class';

export class BalanceSheet{
    id:number;
    credit:number;
    debit:number;
    discount:number;
    finalPrice:number;
    jobsRelatedPrice:number;
    jobsTotalPrice:number;
    notificationCount:number;
    notificationRelatedPrice:number;
    paid:boolean;
    subscriptionPrice:number;
    timeS:string;
    totalPrice:number;
    workStation:WorkStation;
    payment:Payment;
    error: BackendMessage;
}