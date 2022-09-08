import { WorkStation } from './workStation.class';
import { Area } from './area.class';
import { City } from './city.class'
import { BackendMessage } from '../entities/Msg.class'


export class Region {
    id: number;
    name: string;
    type = "Region";
    city: City = new City();
    areas:Area[];
    workStations:WorkStation[];

    workStationCnt: number;
    error: BackendMessage;

}