import { Suggestion } from 'app/entities/suggestion.class';
import { BackendMessage } from './Msg.class';

export class SuggestionState{
    id:number;
    name:string;
    suggestions:Suggestion[];
    error: BackendMessage;
}