import { WorkStation } from './workStation.class';
import { Region } from './region.class'
import { BackendMessage } from '../entities/Msg.class'
import {Request} from './request.class'
export class Area {
    id: number;
    name: string;
    type = "Area";
    region: Region = new Region();
    centerLat: number;
    centerLong: number;
    workStationCnt: number;
    requests: Request[];
    workStations:WorkStation[];
    error: BackendMessage;

}