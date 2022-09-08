import { BackendMessage } from '../entities/Msg.class'

export class TransactionType {
    id: number;
    name: string;
    manual:boolean;
    error:BackendMessage;

}