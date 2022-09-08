import { UserV } from "./userV.class";
import { RequestGeo } from "./requestGeo.class";
import { RequestTime } from "./requestTime.class";

export class RequestV{
    id:number;
    cat3Id:number;
    code:string;
    client:UserV;
    title:string;
    info:string;
    geoData:RequestGeo;
    timeData:RequestTime;
    photos:string[];
}