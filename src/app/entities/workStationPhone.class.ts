import { BackendMessage } from './Msg.class';
import {PhoneType} from './phoneType.class'
import { WorkStation } from 'app/entities/workStation.class';
export class WorkStationPhone{
    id:number;
    error:BackendMessage;
    number:number;
    phoneType:PhoneType = new PhoneType();
    workerStation:WorkStation;
}