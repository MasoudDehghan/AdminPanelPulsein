import { BackendMessage } from "./Msg.class";
import { CityView } from "./cityView.class";

export class RegionView{
    id:number;
    name:string;
    city:CityView;
    workStationCnt:number;
    error:BackendMessage;
}