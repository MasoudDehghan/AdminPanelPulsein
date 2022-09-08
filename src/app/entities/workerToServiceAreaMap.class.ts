import { BackendMessage } from 'app/entities/Msg.class';
import {Region} from './region.class'


export class WorkerToServiceAreaMap{
    id:number;
    error:BackendMessage;
    worker:Worker;
    region:Region;
}