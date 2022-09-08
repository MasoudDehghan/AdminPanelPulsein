import {JobCategory1} from './JobCategory1.class'
import {JobCategory2} from './JobCategory2.class'
import {JobCategory3} from './JobCategory3.class'
import {Keyword} from './keyword.class'
import { BackendMessage } from 'app/entities/Msg.class';
import { Worker } from 'app/entities/worker.class';
export class WorkerToJobsMap{
    id:number;
    error:BackendMessage;    
    jobCategory3:JobCategory3 = null;
    keyword:Keyword;
    worker:Worker;
}