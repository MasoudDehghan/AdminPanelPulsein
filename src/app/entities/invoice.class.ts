import {InvoiceType} from './invoiceType.class'
import {InvoiceItem} from './invoiceItem.class'
import {Suggestion} from './suggestion.class'
import { BackendMessage } from '../entities/Msg.class'

export class Invoice{
    id:number;
    wage:number;
    transfer:number;
    totalPrice:number;
    registerTimeS:string;
    invoiceType:InvoiceType;    
    invoiceItems:InvoiceItem[];
    suggestion:Suggestion;
    error: BackendMessage;
}