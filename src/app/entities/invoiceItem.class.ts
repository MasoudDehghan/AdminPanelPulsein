import {InvoiceItemType} from './invoiceItemType.class'
import {Invoice} from './invoice.class'
import { BackendMessage } from '../entities/Msg.class'

export class InvoiceItem{
    id:number;
    title:string;
    quantity:number;
    unitPrice:number;
    totalPrice:number;
    invoice:Invoice;
    error: BackendMessage;
}