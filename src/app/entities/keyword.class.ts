import {User} from './user.class'
import {WorkerToJobsMap} from './workerToJobsMap.class'
import { BackendMessage } from './Msg.class';

export class Keyword{
    id:number;
    name:string;
    workerToJobsMaps:WorkerToJobsMap[];
    error:BackendMessage;
    
}