import { WorkStation } from './workStation.class';
import { Region } from './region.class'
import { TownShip } from './township.class'
import { BackendMessage } from '../entities/Msg.class'

export class City {
    id: number;
    name: string;
    regions: Region[] = [];
    type = "City";
    township: TownShip = new TownShip();
    centerLat: number;
    centerLong: number;
    workStationCnt:number;
    workStations:WorkStation;
    abrv:string;
    cntrL:string;
    cntrS:string;
    cntrR:string;
    active:boolean;
    error: BackendMessage;

}