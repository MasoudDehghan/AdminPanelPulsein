import { RequestExtraP } from './requestExtraP.class';
import { JobOfferP } from './jobOfferP.class';
import { UserP } from './userP.class';
import {InvoiceP} from './invoiceP.class'
import { BackendMessage } from "../entities/Msg.class";
import { RequestScoreP } from './requestScoreP.class';
import { TransactionP } from './transactionP.class';

export class RequestP{
    id:number;
    error:BackendMessage;	
    code:string;
	title:string;
	cat3:string;
	state:string;
	registerTime:string;
	updateTime:string;
	client:UserP;
	area:string;
	region:string;
	selectedOffer:JobOfferP;
	preInvoice:InvoiceP;
	finalInvoice:InvoiceP;
	score:RequestScoreP;
	extra:RequestExtraP;
	transactions:TransactionP[];
	cancelCause:string;
	sourceType:number;
}