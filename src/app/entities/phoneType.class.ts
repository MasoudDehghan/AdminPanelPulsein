import { WorkStationPhone } from './workStationPhone.class';
import { BackendMessage } from './Msg.class';

export class PhoneType{
    id:number;
    name:string;
    workStationPhones:WorkStationPhone;
    error:BackendMessage;
}