import { NotificationTypeEnum } from './../enums/notificationType.enum';
import { RequestStats } from './../entities/requestStats.class';
export class PortalNotification{
typeId:NotificationTypeEnum;
// 0 :: Clear RequestStats
// 1 :: New RequestStats
// 2 :: SMS
requestStats:RequestStats;
smsCode:string;
mobileNumber:string;
}