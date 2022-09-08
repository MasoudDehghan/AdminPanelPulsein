import { WorkerToJobsMap } from './workerToJobsMap.class';
import { JobCategory3 } from './JobCategory3.class';
import {JobCategory1} from './JobCategory1.class'
import { BackendMessage } from '../entities/Msg.class'

export class JobCategory2{
    id:number = 0;
    name:string;
    header:string;
    icon:string;
    jobCategory1:JobCategory1 = new JobCategory1();
    jobCategory3s:JobCategory3[];
    ename:string;
    error:BackendMessage;
}