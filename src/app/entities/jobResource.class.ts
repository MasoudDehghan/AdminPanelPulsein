import {WorkStation} from './workStation.class'
import { BackendMessage } from './Msg.class';


export class JobResource{
    id:number;
    name:string;
    workStations:WorkStation[]=[];
    error:BackendMessage;
}