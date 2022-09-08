import { Cat3Commission } from './cat3Commission.class';
import { WorkerToJobsMap } from './workerToJobsMap.class';
import {JobCategory2} from './JobCategory2.class'
import { BackendMessage } from '../entities/Msg.class'
import {Request} from './request.class'
import { Cat3ToCityMap } from './cat3ToCityMap.class';
export class JobCategory3{
    id:number = 0;
    name:string;
    icon:string;
    jobCategory2:JobCategory2 = new JobCategory2();
    priority:number;
    viewCnt:number;
    // commissionOnIvoiceItems:number;
    // commissionOnWage:number;
    // commissionOnTransfer:number;
    haveNewSeo : boolean;    
    commission:Cat3Commission = new Cat3Commission();
    requests:Request[];
    workerToJobsMaps:WorkerToJobsMap[];
    ename:string;
    emergencyEnable:boolean;
	nowToStartPeriod:number;
    invoiceRequired:boolean;
    destinationAddressRequired:boolean;
    activeCities :Cat3ToCityMap[];
    error:BackendMessage;
}   