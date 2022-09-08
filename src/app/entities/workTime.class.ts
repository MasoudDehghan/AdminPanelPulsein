import { BackendMessage } from '../entities/Msg.class'

export class WorkTime{
    id:number;
	saActive:boolean;	
	saStartH:number;
	saStartM:number;
	saStopH:number;
	saStopM:number;
	
	suActive:boolean;
	suStartH:number;
	suStartM:number;
	suStopH:number;
	suStopM:number;
	
	moActive:boolean;
	moStartH:number;
	moStartM:number;
	moStopH:number;
	moStopM:number;

	tuActive:boolean;
	tuStartH:number;
	tuStartM:number;
	tuStopH:number;
	tuStopM:number;

	weActive:boolean;
	weStartH:number;
	weStartM:number;
	weStopH:number;
	weStopM:number;
	
	thActive:boolean;
	thStartH:number;
	thStartM:number;
	thStopH:number;
	thStopM:number;
	
	frActive:boolean;
	frStartH:number;
	frStartM:number;
	frStopH:number;
	frStopM:number;

	error:BackendMessage;
}