import { Payment } from 'app/entities/payment.class';
import { BackendMessage } from './Msg.class';


export class PaymentMethod{
    id:number;
    name:string;
    payments:Payment[];
    error:BackendMessage;
    
}