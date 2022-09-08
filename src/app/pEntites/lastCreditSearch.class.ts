export class LastCreditSearch{
    workerSearch:boolean;
	userId:number;
	userFirstName:string;
	userLastName:string;
	creditMin:number;
	creditMax:number;
	updateTimeStart:string;
	updateTimeEnd:string;
	workerCode:string;
	workerRegisterStateId:number;

	f_userId:boolean;
	f_userFirstName:boolean;
	f_userLastName:boolean;
	f_credit:boolean;
	f_updateTime:boolean;
	f_workerCode:boolean;
	f_workerRegisterStateId:boolean;

	firstRow:number = 0;
    pageSize:number = 8;
    totalSize:number = 0;
	sortById:number = 1;
    sortOrderId:number = 1;
    sortBy:string = "";
    sortOrder: string = "";
/*	
 	1-credit
	2-updateTime
	3-firstName
	4-lastName
	5-workerCode
*/	

/*	
	1-asc
	2-desc
*/	

}