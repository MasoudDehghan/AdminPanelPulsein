import { BackendMessage } from './../entities/Msg.class';
import { WorkerP } from "./workP.class";
import { SuggestionP } from "./suggestionP.class";
export class JobOfferP{
    id:number;
	error:BackendMessage;	
	registerTime:string;
	state:string;
	worker:WorkerP;
	suggestion:SuggestionP;
	reActiveEnable:boolean;
}