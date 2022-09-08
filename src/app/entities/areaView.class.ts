import { BackendMessage } from "./Msg.class";
import { Region } from "./region.class";
import { RegionView } from "./regionView.class";

export class AreaView{
    id:number;
    name:string;
    region:RegionView;
    workStationCnt:number;
    error:BackendMessage;
}