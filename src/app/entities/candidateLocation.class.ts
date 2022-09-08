import { User } from './user.class';
import { Area } from './area.class';
import { City } from './city.class'
import { BackendMessage } from '../entities/Msg.class'


export class CandidateLocation {
    id: number;
    title: string;
    user:User;
    area:Area;
    address:string;
    lat:number;
    longg:number;
    postalCode:string;
    error: BackendMessage;

}