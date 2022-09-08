import { verifiedLabel, unverifiedLabel } from './../shared/global';
import {User} from './user.class'
import {DocumentType} from './DocumentType.class'
import {WorkStation} from './workStation.class'
import {BackendMessage} from './Msg.class'

export class WorkerStationDocument{
    id:number;
	info:string;
	photo:string;
	verifyFlag:number;
	verifyTimeS:string;
	verifyBy:User;
	documentType:DocumentType;
	workStation: WorkStation;
	error:BackendMessage;
	verifyStr:string;
	
}