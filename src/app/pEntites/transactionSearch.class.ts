import { Constant } from './../shared/constants.class';
import { BackendMessage } from "../entities/Msg.class";

export class TransactionSearch{
    id:number;
	error:BackendMessage;	
	userId:number;
    userFirstName:string;
	userLastName:string;
	typeId:number;
	cash:boolean;
	registerTimeStart:string;
	registerTimeEnd:string;
	trackingCode:string;
	amountMin:number;
	amountMax:number;
	refUserId:number;
	f_userId:boolean;
	f_userFirstName:boolean;
	f_userLastName:boolean;
	f_typeId:boolean;
	f_cash:boolean;
	f_registerTime:boolean;
	f_trackingCode:boolean;
	f_amount:boolean;
	f_refUserId:boolean;

	firstRow:number = 0;
    pageSize:number = Constant.lazyLoadingPageSize;
    totalSize:number = 0;
	sortById:number = 1;
    sortOrderId:number = 1;
    sortBy:string = "";
    sortOrder: string = "";
	
}