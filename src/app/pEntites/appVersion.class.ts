import { BackendMessage } from './../entities/Msg.class';
export class AppVersion{
    id:number;
	error:BackendMessage;	
	name:string;
	info:string;
	workerApp:boolean;
	active:boolean;
	releaseTimeS:string;
	ios:boolean = false;
	published:boolean = false;
}