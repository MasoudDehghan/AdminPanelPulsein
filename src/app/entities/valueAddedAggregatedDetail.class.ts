export class ValueAddedAggregatedDetail{
    id:number;
	userId:number;
	requestId:number;
	code:string;
	cat3:string;
	clientFirstName:string;
	clientLastName:string;
	factorPrice:number;
	totalCommision:number;//:C
	accountantNumber:string;
	cash:boolean;
	workerIncome:number;
	valueAdded:number;//B=A*0.09
	commision:number;//A=C/1.09
    registerTimeS:string;
	accNumberRegisterTimeS:string;
	
	workerName:string;
}