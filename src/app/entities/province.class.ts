import {TownShip} from './township.class'
import { BackendMessage } from '../entities/Msg.class'
export class Province{
    id:number;
    name:string;
    townShips:TownShip[] = [];
    type = "Province";
    error:BackendMessage;
}