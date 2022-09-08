import { BackendMessage } from './../entities/Msg.class';
import { WorkStationExtraP } from "./workStationExtraP.class";

export class WorkStationP{
    id:number;
	error:BackendMessage;	
	code:string;
	extra:WorkStationExtraP;
}