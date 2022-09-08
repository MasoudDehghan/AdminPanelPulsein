import { InvoiceItemP } from './invoiceItemP.class';
import { BackendMessage } from "../entities/Msg.class";

export class InvoiceP{
    id:number;
	error:BackendMessage;		
	wage:number;
	transfer:number;
	totalPrice:number;
	invoiceItems:InvoiceItemP[];
}