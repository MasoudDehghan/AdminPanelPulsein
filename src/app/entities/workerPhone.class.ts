import { Worker } from './worker.class';
import { BackendMessage } from './Msg.class';
export class WorkerPhone{
    id:number;
    number:number;
    error: BackendMessage;
    worker:Worker;
}