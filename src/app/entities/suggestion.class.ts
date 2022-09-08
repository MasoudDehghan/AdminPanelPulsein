import { JobOffer } from './jobOffer.class';
import {SuggestionState} from './suggestionState.class';
import {Invoice} from './invoice.class'
import { BackendMessage } from './Msg.class';

export class Suggestion{
    id:number;
    info:string;
    surveyRequired: boolean;
    currentLat:number;
    currentLong:number;
    registerTimeS:string;    
    closingTimeS:string;
    jobOffer:JobOffer;
    suggestionState:SuggestionState;
    invoice:Invoice;
    error: BackendMessage;
}