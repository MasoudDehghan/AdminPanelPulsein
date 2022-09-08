import { WorkerToJobsMap } from './workerToJobsMap.class';
import { WorkStationJob } from './workStationJob.class';
import { JobCategory2 } from './JobCategory2.class';
import { BackendMessage } from '../entities/Msg.class'

export class JobCategory1{
    id:number = 0;
    name:string;
    icon:string;
    workStationCnt:number;
    jobCategory2s:JobCategory2[];
    workStationJobs:WorkStationJob[];
    ename:string;
    error:BackendMessage;
}