import { DiscountDetail } from "./discountDetail.class";

export class DiscountV{
    id:number;

	code:string;
	
	active:boolean;

	endTime:string;
	
	percent:number;

	maxCredit:number;

	totalCnt:number;

	usedCnt:number;
	registerTime:string;
	detail:DiscountDetail;
}