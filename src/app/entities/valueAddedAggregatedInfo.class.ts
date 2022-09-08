import { ValueAddedAggregatedDetail } from "./valueAddedAggregatedDetail.class";

export class ValueAddedAggregatedInfo{
    workerId : number;
	workerFirstName:string;
	workerLastName:string;
	mobileNumber:string;
	nationalCode:string;
	address:string;
	postalCode:string;
	province:string;
	township:string;
	city:string;
	
	accountantNumber : string = null;
	registered : boolean;
	accNumberRegisterTimeS:string;
	items : ValueAddedAggregatedDetail[];
	sum : ValueAddedAggregatedDetail;

	printable:boolean = false;
}