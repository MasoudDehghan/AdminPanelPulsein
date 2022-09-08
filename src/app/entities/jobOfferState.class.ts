import { JobOffer } from './jobOffer.class';
import { BackendMessage } from './Msg.class';

export class JobOfferState{
    id:number;
    name:string;
    jobOffers:JobOffer[]=[];
    error:BackendMessage;
}