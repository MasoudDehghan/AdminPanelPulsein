import {User} from './user.class'
import {DocumentType} from './DocumentType.class'
import {Worker} from './worker.class'
import {BackendMessage} from './Msg.class'

export class WorkerDocument{
    id:number;
	info:string;
	photo:string;
	verifyFlag:number;
	verifyTimeS:string;
	verifyBy:User;
	documentType:DocumentType;
	worker:Worker;
	error:BackendMessage;
}