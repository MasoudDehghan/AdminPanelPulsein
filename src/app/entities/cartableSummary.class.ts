import { BackendMessage } from '../entities/Msg.class'

export class CartableSummary{
	wsDocCnt:number;
	wrDocCnt:number;
	wsNewCnt:number;
	wrNewCnt:number;
	wsW4Doc:number;
	wsW4Area:number;
	wrW4Doc:number;
	wrDocCompleteCntW4Ws:number;
	userPhotoCnt:number;
	wsLogoCnt:number;
	wsCatalogCnt:number;
	wsDocCompleteCnt:number;
	wrDocCompleteCnt:number;
	reqExpireCnt:number;
	error:BackendMessage;	
}