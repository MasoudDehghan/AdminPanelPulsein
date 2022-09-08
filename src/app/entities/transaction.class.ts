import { TransactionType } from './transactionType.class';
import { User } from './user.class';
import { Request } from '../entities/Request.class';
import { BackendMessage } from '../entities/Msg.class'

export class Transaction {
    id: number;
    amount: number;
    balance: number;
    error:BackendMessage;
    registerTimeS:string;
    inc:boolean;
    cach:boolean;
    trackingCode:string;
    request:Request;
    user:User;
    type:TransactionType;
    referenceUser:User;


}