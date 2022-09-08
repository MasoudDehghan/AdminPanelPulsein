import { TransactionSummary } from './../entities/transactionSummary.class';
import { BackendMessage } from "../entities/Msg.class";
import { TransactionP } from 'app/pEntites/transactionP.class';

export class TransactionSearchResult{
    id:number;
    error:BackendMessage;	
	totalSize:number;
	firstRow:number;
	pageSize:number;
	summary:TransactionSummary;
	transactionList:TransactionP[];
}