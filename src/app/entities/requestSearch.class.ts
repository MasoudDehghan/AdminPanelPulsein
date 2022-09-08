export class RequestSearch{
    code:string;
	title:string;
	jobCategory1Id:number;
	jobCategory2Id:number;
	jobCategory3Id:number;
	stateIdList:number[] = [];
	priceMin:number;
	priceMax:number;
	registerTimeStart:string;
	registerTimeEnd:string;
	updateTimeStart:string;
	updateTimeEnd:string;
	clientFirstName:string;
	clientLastName:string;
	clientMobileNumber:string;
	provinceId:number;
	townshipId:number;
	cityId:number;
	regionId:number;
	areaId:number;
	address:string;
	selectedWorkerCode:string;
	workerFirstName:string;
	workerLastName:string;

	f_code:boolean = false;
	f_title:boolean = false;
	f_jobCategory1Id:boolean = false;
	f_jobCategory2Id:boolean = false;
	f_jobCategory3Id:boolean = false;
	f_stateId:boolean = false;
	f_price:boolean = false;
	f_updateTime:boolean = false;
	f_registerTime:boolean = false;
	f_clientFirstName:boolean = false;
	f_clientLastName:boolean = false;
	f_clientMobileNumber:boolean = false;
	f_provinceId:boolean = false;
	f_townshipId:boolean = false;
	f_cityId:boolean = false;
	f_regionId:boolean = false;
	f_areaId:boolean = false;
	f_address:boolean = false;
	f_selectedWorkerCode:boolean = false;
	f_workerFirstName:boolean = false;
	f_workerLastName:boolean = false;
	firstRow:number = 0;
    pageSize:number = 8;
    totalSize:number = 0;
	sortById:number = 1;
	/*  
   1-r.id
  2-r.title
  3-r.jobCategory3.name
  4-r.requestState.name
  5-r.registerTime
  6-r.updateTime
  7-r.user.firstName
  8-r.user.lastName
  9-r.user.mobileNumber
  10-r.area.name
  11-r.area.region.name
  12-r.address
*/
	sortOrderId:number = 1;
	
    sortBy:string = "";
    sortOrder: string = "";
}