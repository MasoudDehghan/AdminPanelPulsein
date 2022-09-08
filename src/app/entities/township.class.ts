import { City } from './city.class'
import {Province} from './province.class'
import { BackendMessage } from '../entities/Msg.class'

export class TownShip {
    id: number;
    name: string;
    cities: City[] = [];
    type = "TownShip";
    province:Province = new Province();
    error:BackendMessage;

}