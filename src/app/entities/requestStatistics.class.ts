import { BackendMessage } from '../entities/Msg.class'

export class RequestStatistics{

	reqWait4Suggest:number = 0;
	//reqWait4Survey:number = 0;
	//reqWait4SurveyAck:number = 0;
	reqWait4Do:number = 0;
	reqWait4DoAck:number = 0;
	reqInProgress:number = 0;
	reqWait4Payment:number = 0;
	reqWait4Nazarsanji:number = 0;
	reqSuggestFinished:number;
	reqInProgressExpired:number = 0;
	reqWait4PaymentExpired:number = 0;
	reqExpire:number = 0;
	reqFinished:number = 0;
	reqCanceledC:number = 0;
	reqCanceledW:number = 0;
	reqCanceledO:number = 0;
	reqExpireToday:number = 0;
	reqFinishedToday:number = 0;
	reqCanceledTodayC:number = 0;
	reqCanceledTodayW:number = 0;
	reqCanceledTodayO:number = 0;
	error:BackendMessage;
}