import { UserP } from './userP.class';
import { WorkerP } from './workP.class';
import { BackendMessage } from "app/entities/Msg.class";

export class LastCreditSearchResult{
    error:BackendMessage;
    totalSize:number;
    firstRow:number;
    pageSize:number;
    workers:WorkerP[];
    users:UserP[];
}