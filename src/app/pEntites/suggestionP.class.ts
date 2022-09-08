import { BackendMessage } from '../entities/Msg.class';
import { Invoice } from '../entities/invoice.class';
import { SuggestionExtraP } from './suggestionExtraP.class';
export class SuggestionP{
    id:number;
	error:BackendMessage;	
	registerTime:string;
	state:string;
	invoice:Invoice;
	extra:SuggestionExtraP;
	seenByClient:boolean;
}