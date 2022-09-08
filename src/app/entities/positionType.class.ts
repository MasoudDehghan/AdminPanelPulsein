import { WorkStation } from './workStation.class';
import { BackendMessage } from './Msg.class';


export class PositionType{
    id:number;
    name:string;    
    workStations:WorkStation[];
    error:BackendMessage;
}