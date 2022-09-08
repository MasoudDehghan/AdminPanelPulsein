import { BackendMessage } from '../entities/Msg.class'
import { CartableSummary } from './cartableSummary.class';

export class Statistics{
	workStationCnt:number = 0;
	workerCnt:number = 0;
	cartableCnt:number = 0;
	wRegCompleteCnt:number = 0;
	wActiveCnt:number = 0;
	workerCntToday:number = 0;
	activeClientCnt:number = 0;
	reqWait4Suggest:number = 0;
	//reqWait4Survey:number = 0;
	//reqWait4SurveyAck:number = 0;
	reqWait4Do:number = 0;
	reqWait4DoAck:number = 0;
	reqWait4Payment:number = 0;
	reqWait4Nazarsanji:number = 0;
	reqSuggestFinished:number = 0;
	reqInProgress:number = 0;
	reqInProgressExpired:number = 0;
	reqWait4PaymentExpired:number = 0;
	totalPrice:number = 0;
	activeClientCntToday: number = 0;
	reqTotalOnProgress: number = 0;
	cartableSummary:CartableSummary;
	error:BackendMessage;
}