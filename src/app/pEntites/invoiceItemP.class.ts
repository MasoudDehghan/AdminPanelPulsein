import { BackendMessage } from "../entities/Msg.class";

export class InvoiceItemP{
    id:number;
	error:BackendMessage;	
	title:string;
	quantity:number;
	unitPrice:number;
	totalPrice:number;
}