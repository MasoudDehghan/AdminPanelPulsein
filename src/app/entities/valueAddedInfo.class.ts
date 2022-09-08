export class ValueAddedInfo{
	id:number;
	workerId:number;
	userId:number;
	requestId:number;
	code:string;
	cat3:string;
	registerTimeS:string;
	clientFirstName:string;
	clientLastName:string;
	workerFirstName:string;
	workerLastName:string;
	mobileNumber:string;
	nationalCode:string;
	address:string;
	postalCode:string;
	province:string;
	township:string;
	city:string;
	factorPrice:number;
	totalCommision:number;//C=A+B

	accountantNumber:string;
	cash:boolean;
	commision:number;//A
	workerIncome:number;
	valueAdded:number;//B=A*0.09
	//totalFactorPrice:number;//C=A+B

	registered:boolean;
	accNumberRegisterTimeS:string;

	clientName:string;
	workerName:string;
	printable:boolean  = false;
}