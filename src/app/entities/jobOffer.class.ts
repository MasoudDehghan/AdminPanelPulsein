import { JobOfferState } from './jobOfferState.class';
import { Suggestion } from './suggestion.class';
import { BackendMessage } from './Msg.class';
import {WorkStation} from './workStation.class'
import {Request} from './request.class'
export class JobOffer{
    id:number;
    name:string;
    registerTimeS:string;
    closingTimeS:string;
    request:Request;
    jobOfferState:JobOfferState;
    worker:Worker;
    suggestion:Suggestion;    
    error:BackendMessage;
}