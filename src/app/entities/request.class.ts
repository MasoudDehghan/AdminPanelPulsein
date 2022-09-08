import { RequestStateHistory } from './requestStateHistory.class';
import { CandidateLocation } from './candidateLocation.class';
import { JobOffer } from './jobOffer.class';
import {User} from './user.class'
import {City} from './city.class'
import {Region} from './region.class'
import {Area} from './area.class'
import {JobCategory1} from './JobCategory1.class'
import {JobCategory2} from './JobCategory2.class'
import {JobCategory3} from './JobCategory3.class'
import {RequestState} from './requestState.class'
import {RequestScore} from './requestScore.class'
import {RequestPhoto} from './requestPhoto.class'
import {Invoice} from './invoice.class'
import { BackendMessage } from '../entities/Msg.class'
import {Worker} from '../entities/worker.class'
import { Suggestion } from 'app/entities/suggestion.class';
export class Request{
	id:number;
	code:string;
	title:string;
	postalCode:string;	
	address:string;
	info:string;
	lat:number;
	longg:number;
	photo:string;
	updateTimeS:string;
	searchAround:boolean;    
	startTimeS:string;
	endTimeS:String;
	expireState:boolean;
	emergency:boolean;	
	video:string;
	voice:string;
	requestPhotos:RequestPhoto[];
	stateHistories:RequestStateHistory[];
	jobOffers:JobOffer;
	user:User;
	jobCategory3:JobCategory3;
	area:Area;
	requestState:RequestState;
	requestScore:RequestScore;
	worker:Worker;
	selectedSuggestion:Suggestion;
	proformaInvoice:Invoice;
	finalInvoice:Invoice;
	suggestionCnt:number;
	averagePrice:number;
	priceCnt:number;
	remainTimeS:string;
	candidateLocation:CandidateLocation;
	error: BackendMessage;

	get regionArea(){
		return this.area.region.name + "-" + this.area.name;
	}
	
}