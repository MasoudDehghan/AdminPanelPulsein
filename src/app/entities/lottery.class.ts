import {User} from './user.class'
import {BonusType} from './bonusType.class'
import { BackendMessage } from './Msg.class';

export class Lottery{
    id:number;
	paid:boolean;
	timeS:string;
	user:User;
	bonusType:BonusType;
	error:BackendMessage;
}