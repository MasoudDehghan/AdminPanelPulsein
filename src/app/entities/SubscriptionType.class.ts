import { BackendMessage } from '../entities/Msg.class'
import { WorkStation } from 'app/entities/workStation.class';

export class SubscriptionType {
    id: number;
    jobPricePercent: number = 0;
    name: string;
    notificationPercent: number = 0;
    notificationPrice: number = 0;
    price: number = 0;
    workStations:WorkStation;
    error: BackendMessage;
}