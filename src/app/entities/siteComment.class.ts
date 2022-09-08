import { BackendMessage } from './Msg.class';

export class SiteComment{
    id:number;
    email:string;
    name:string;
    subject:string;
    phone:string;
    message:string;
    timeS:string;    
    error: BackendMessage;
    
}