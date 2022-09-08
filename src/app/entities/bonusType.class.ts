import {Lottery} from './lottery.class'
import { BackendMessage } from '../entities/Msg.class'

export class BonusType{
    id:number;
	name:string;
    lotteries:Lottery[];
    error: BackendMessage;
}