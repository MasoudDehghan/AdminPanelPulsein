import { ErrorV } from "./errorV.class";

export class WorkerSummary extends ErrorV{
    id:number;
    firstName:string;
    lastName:string;
    wsTitle:string;
    code:string;
    mobileNumber:string;
    active:boolean;
    registerState:string;
    registerTime:string;
    updateTime:string;
    jobCat3Ids:number[]=[];
    appVersion:string;
    score:number;
    offerBlock:boolean;
    haveBond:boolean;
    coveredCityList:string[];
}