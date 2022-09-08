export class JobCategory{
    id:number;
    name:string;
    icon:string;
    parentID:number;
    priority:number = 1;
    ename:string;
    emergencyEnable:boolean;
	nowToStartPeriod:number;
    invoiceRequired:boolean;
    destinationAddressRequired:boolean;
}