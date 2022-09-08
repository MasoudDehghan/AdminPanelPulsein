import { BackendMessage } from "../entities/Msg.class";

export class RequestPhotoP{
    id:number;
    error:BackendMessage;	
    info:string;
    photo:string;
}