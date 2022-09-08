import { RequestStateHistory } from './requestStateHistory.class';
import { BackendMessage } from './Msg.class';
import { Request } from 'app/entities/request.class';


export class RequestState{
    id:number;
    name:string;
    requests:Request[];
    stateHistories:RequestStateHistory[];
    error: BackendMessage;
    
}