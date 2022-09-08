import { BackendMessage } from "../entities/Msg.class";

export class RequestScoreP{
    id:number;
    error:BackendMessage;	
    priceScore:number;
    satisfactionScore:number;
    timeScore:number;
}