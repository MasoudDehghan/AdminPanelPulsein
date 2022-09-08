import { BackendMessage } from './../entities/Msg.class';
import { UserP } from './userP.class';
import { WorkerExtraP } from "./workerExtraP.class";

export class WorkerP{
    id:number;
	error:BackendMessage;	
	code:string;
	user:UserP;
	extra:WorkerExtraP;
	registerStateId:number;
	registerState:string;
}