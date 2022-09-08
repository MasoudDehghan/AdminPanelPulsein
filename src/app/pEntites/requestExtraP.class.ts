import { RequestPhotoP } from "./requestPhotoP.class";

export class RequestExtraP{
    postalCode:string;
	address:string;
	info:string;
	lat:number;
	longg:number;
	searchAround:boolean;
	startTime:string;
	endTime:string;
	expireState:number;
	emergency:boolean;
	video:string;
	voice:string;
	photos:RequestPhotoP[];
}