import { CommercialNoteItemV } from "./commercialNoteItemV.class";

export class CommercialNoteV{
    id:number;
	title:string;
	content:string;
    vibrate:string;
    sound:string;
    led:string;
	big:string;
    imageUrl:string;
	jobCat3Id:number;
	jobCat3Name:string;
	senderFirstName:string;
	senderLastName:string;
	sendTime:string;	
	items :CommercialNoteItemV[] = [];
}