import { BackendMessage } from './Msg.class';
export class WorkerScore{
    id:number;
	documentScore:number;
	priceScore:number;
	satisfactionScore:number;
	timeScore:number;
	totalScore:number;
	cnt:number;
	error: BackendMessage;
}