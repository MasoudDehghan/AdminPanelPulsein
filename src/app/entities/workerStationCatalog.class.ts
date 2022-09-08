import {User} from './user.class'
import {WorkStation} from './workStation.class'
import {BackendMessage} from './Msg.class'
export class WorkerStationCatalog{
	id:number;
	info:string;
	photo:string;
	verifyFlag:number;
	verifyTimeS:string;
	verifyBy:User;
	workStation:WorkStation;
	error:BackendMessage;
}