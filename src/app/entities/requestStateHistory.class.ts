import { RequestState } from './requestState.class';
import { BackendMessage } from './Msg.class';
import { Request } from 'app/entities/request.class';

export class RequestStateHistory{
    id:number;
    request:Request;
    requestState:RequestState;
    updateTimeS:string;
    error: BackendMessage;
    
}