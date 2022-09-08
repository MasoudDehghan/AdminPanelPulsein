import { WorkStation } from './workStation.class';
import { BackendMessage } from './Msg.class';
export class WorkStationScore{
    id:number;
    error:BackendMessage
    jobScore:number;
    workerScore:number;
    totalScore:number;
    workStation:WorkStation;
}